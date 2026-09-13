/**
 * actions.ts — server actions: the ONLY bridge between the client chat UI
 * and the database helpers in `./direct`.
 *
 * Rules followed here:
 * - The sender id always comes from the session cookie, never from the
 *   client (a malicious client could otherwise impersonate anyone).
 * - Every payload back to the client is serialized (Dates → ISO strings).
 * - `null` / `[]` means "not allowed or nothing to do" — the UI treats a
 *   null as a silent no-op and keeps its local state untouched.
 */
"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { getMessages, getOrCreateDirectChat, sendMessage } from "./direct";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "./user";

/** A message shaped for the client: identical to the db row but JSON-safe. */
export interface SentMessageData {
  id: string;
  content: string;
  createdAt: string;
  creatorId: string;
  chatId: string;
}

/** A freshly opened chat shaped for the client (members carry usernames). */
export interface OpenedChatData {
  id: string;
  name: string;
  updatedAt: string;
  members: { id: string; username: string }[];
}

/** Reads the logged-in user id from the session cookie. Null = logged out. */
// get the session from getSession() and use it to get the userId and return either userId if exists or null
async function currentUserId(): Promise<string | null> {
  const session = await getSession();
  const userId = session?.userId as string | undefined;
  return userId ?? null;
}

/**
 * Guard: is this user actually a member of this chat?
 * Every read/write below goes through this so ids from the client
 * can never leak other people's conversations.
 */
// find a unique chat where the id is the chatId and select the members id only and return if member's id is equal to the userId
async function isMember(userId: string, chatId: string): Promise<boolean> {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { members: { select: { id: true } } },
  });
  return chat?.members.some((member) => member.id === userId) ?? false;
}

/** Converts a Prisma message row into the JSON-safe client shape. */
// For some reason it is implemented, to safely parse the message which is already of the correct type, I think this is only implemented for transforming createdAt to an ISO string and nothing more
function serializeMessage(message: {
  id: string;
  content: string;
  createdAt: Date;
  creatorId: string;
  chatId: string;
}): SentMessageData {
  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    creatorId: message.creatorId,
    chatId: message.chatId,
  };
}

// First message to a person with no chat yet: the chat is created here
// and the message is sent with it in one go, so the client can prepend
// the new chat and drop the message in without any refetch.
/**
 * Creates (or reuses) the DM with `friendId` and sends the first message.
 * Returns the chat + message for the client to merge into local state,
 * or null when the send is invalid (logged out, self-chat, empty text,
 * or no friendship) — in which case the UI keeps the pending pane open.
 */
// get the currentUserId from the function above and take in a content which is most likely the input result from the input box in the chat
// get it's trimmed version and if there is either no userId or friendId or if the friend is the user or trimmed content is empty then return null
// use the getOrCreateDirectChat function above to get the chat from the friendId from the args and the userId from the function above and if there is no chat then return null
// there is then a message created with the chat.id and it's text and the userId as the creatorId
// find member where id is either the userId or the friendId and select it's id and username
// return a chat object and make it's id equal to the chat.id, name equal to the chat.name, updatedAt equal to the chat.updatedAt and members equal to the members. I think this is too implemented for converting the updatedAt to an ISO string
// with the chat object a message object is also returned that is the return of the other function that is implemented above which also converts to ISO string for some reason
export async function handleSendFirstMessage(
  friendId: string,
  content: string,
): Promise<{ chat: OpenedChatData; message: SentMessageData } | null> {
  const userId = await currentUserId();
  const text = content.trim();
  if (!userId || !friendId || friendId === userId || !text) return null;

  const chat = await getOrCreateDirectChat(userId, friendId);
  if (!chat) return null;

  const message = await sendMessage(chat.id, text, userId);
  const members = await prisma.user.findMany({
    where: { id: { in: [userId, friendId] } },
    select: { id: true, username: true },
  });

  return {
    chat: {
      id: chat.id,
      name: chat.name,
      updatedAt: chat.updatedAt.toISOString(),
      members,
    },
    message: serializeMessage(message),
  };
}

/**
 * Sends a message into an existing chat. Membership-checked; returns the
 * saved message so the client can append it to the open thread instantly.
 */
// get the current userId and text and if there is no user or chat or text the return null and then call the send message with the chatId from the args and the text from the args and the userId from the function above
// return the serializeMessage
// I think we could  have reused the top function based on a condition but alas the thing is retarded
export async function handleSendMessage(
  chatId: string,
  content: string,
): Promise<SentMessageData | null> {
  const userId = await currentUserId();
  const text = content.trim();
  if (!userId || !chatId || !text) return null;
  if (!(await isMember(userId, chatId))) return null;

  const message = await sendMessage(chatId, text, userId);
  return serializeMessage(message);
}

/**
 * Sends a friend request. Guards: logged in, not yourself, no pending
 * request already open in either direction, and not already friends.
 * Returns the new request id so the UI can flip to Requested and later
 * cancel exactly that row. Null = nothing to do (UI keeps current state).
 */
// Get the userId from the above function and check if ther is either no user or recipient or if the recipient is the user then return null
// find first friendship where either the requester is user and recipient is the recipient or vice versa and select the id and status and if there is none then return null
// sendFriend request from the above function with the userId from the above function and recipientid from args and return the requestId from this request
export async function handleSendFriendRequest(
  recipientId: string,
): Promise<{ requestId: string } | null> {
  const userId = await currentUserId();
  if (!userId || !recipientId || recipientId === userId) return null;

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userId, recipientId },
        { requesterId: recipientId, recipientId: userId },
      ],
    },
    select: { id: true, status: true },
  });
  if (existing) return null;

  const request = await sendFriendRequest(userId, recipientId);
  return { requestId: request.id };
}

/**
 * Cancels an outgoing pending request. Ownership-checked: only the
 * requester can cancel, and only while it is still pending — otherwise
 * the delete is a silent no-op that still returns success (idempotent).
 */
// get the userId and check fi there is either no user or requester and return success status as false if either is true
// find unique friendship where id is the requestId and seelct the requesterId and the status and if there is none or if the requester is not the user then return success status as false
// if the existing status is not equal to pending aka is accepted then return success status as true and call the cancelFriendRequest fn with the args requestId and return success as true
export async function handleCancelFriendRequest(
  requestId: string,
): Promise<{ success: boolean }> {
  const userId = await currentUserId();
  if (!userId || !requestId) return { success: false };

  const existing = await prisma.friendship.findUnique({
    where: { id: requestId },
    select: { requesterId: true, status: true },
  });
  if (!existing || existing.requesterId !== userId) {
    return { success: false };
  }
  if (existing.status !== "PENDING") return { success: true };

  await cancelFriendRequest(requestId);
  return { success: true };
}

/**
 * Accepts an inbound pending request. Only the recipient can accept, and
 * only while it is still pending. Returns success so the UI can move the
 * row into the friends list instantly.
 */
// get userId and validate the user and the requestId and return success status as false if either doesn't exist
// find unique friendship where id is requestId and select the recipientId and status
// if there is none or if the recipient is not the user or if the statis is not pending aka the req is accepted then return success status as false
// then accept the friend request with the args requestId and return the success status as true
export async function handleAcceptFriendRequest(
  requestId: string,
): Promise<{ success: boolean }> {
  const userId = await currentUserId();
  if (!userId || !requestId) return { success: false };

  const existing = await prisma.friendship.findUnique({
    where: { id: requestId },
    select: { recipientId: true, status: true },
  });
  if (
    !existing ||
    existing.recipientId !== userId ||
    existing.status !== "PENDING"
  ) {
    return { success: false };
  }

  await acceptFriendRequest(requestId);
  return { success: true };
}

/**
 * Declines an inbound pending request (deletes the row). Same recipient-
 * only guard as accept. Returns success so the UI can drop the row
 * instantly.
 */
// get the userId and validate the user and requestId and if either doesn't exist then return success status as false
// find unique friendship where id is requestId and select the recipientid and status and if there is none or if recipient is not user or if the status is not pending then return success status as false
// then await the rejectFriendRequest with the args requestId and return the success status as true
export async function handleRejectFriendRequest(
  requestId: string,
): Promise<{ success: boolean }> {
  const userId = await currentUserId();
  if (!userId || !requestId) return { success: false };

  const existing = await prisma.friendship.findUnique({
    where: { id: requestId },
    select: { recipientId: true, status: true },
  });
  if (
    !existing ||
    existing.recipientId !== userId ||
    existing.status !== "PENDING"
  ) {
    return { success: false };
  }

  await rejectFriendRequest(requestId);
  return { success: true };
}

/**
 * Fresh message history for one chat, oldest first. Called every time a
 * thread is opened so the pane never shows stale data; membership-checked.
 */
// get the userId and validate the user and the chatId and if either doesn't exist then return an empty array
// if the userId is not member of the chat then return an empty array
// then await the messages by calling the getMessages with the args chatId
// return the mapped messages which are serialized
export async function handleGetMessages(
  chatId: string,
): Promise<SentMessageData[]> {
  const userId = await currentUserId();
  if (!userId || !chatId) return [];
  if (!(await isMember(userId, chatId))) return [];

  const messages = await getMessages(chatId);
  return messages.map(serializeMessage);
}
