"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import {
  getMessages,
  getOrCreateDirectChat,
  sendMessage,
} from "./direct";

export interface SentMessageData {
  id: string;
  content: string;
  createdAt: string;
  creatorId: string;
  chatId: string;
}

export interface OpenedChatData {
  id: string;
  name: string;
  updatedAt: string;
  members: { id: string; username: string }[];
}

async function currentUserId(): Promise<string | null> {
  const session = await getSession();
  const userId = session?.userId as string | undefined;
  return userId ?? null;
}

async function isMember(userId: string, chatId: string): Promise<boolean> {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { members: { select: { id: true } } },
  });
  return chat?.members.some((member) => member.id === userId) ?? false;
}

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
// and the message is sent with it in one go.
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

export async function handleGetMessages(
  chatId: string,
): Promise<SentMessageData[]> {
  const userId = await currentUserId();
  if (!userId || !chatId) return [];
  if (!(await isMember(userId, chatId))) return [];

  const messages = await getMessages(chatId);
  return messages.map(serializeMessage);
}
