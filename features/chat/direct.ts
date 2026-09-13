"use server";
import prisma from "@/lib/db";

// get the first friendship where the status is accepted and either the requester is user and the recipient is friend or vice versa and if no friendship then return null
// finds an existing chat where isGroup is false and members contains both user  and friendId and if exists and if the members length is 2 then return the chat
// finds a unique user with the id of the friend and only select the username
// create a new chat with the data either the friend's username or a generic name and the isGroup bool is false and members would be an array of the id of user and friend Id
// and then return chat
export async function getOrCreateDirectChat(userId: string, friendId: string) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: userId, recipientId: friendId },
        { requesterId: friendId, recipientId: userId },
      ],
    },
  });
  if (!friendship) return null;

  const existing = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      members: {
        every: { id: { in: [userId, friendId] } },
      },
    },
    include: {
      members: { select: { id: true } },
    },
  });
  if (existing && existing.members.length === 2) return existing;

  const friend = await prisma.user.findUnique({
    where: { id: friendId },
    select: { username: true },
  });

  const chat = await prisma.chat.create({
    data: {
      name: friend?.username ?? "Direct message",
      isGroup: false,
      members: {
        connect: [{ id: userId }, { id: friendId }],
      },
    },
  });
  return chat;
}

// create a new message where the data is chatId content and creatorid and return the message
export async function sendMessage(
  chatId: string,
  content: string,
  creatorId: string,
) {
  const message = await prisma.message.create({
    data: {
      chatId,
      content,
      creatorId,
    },
  });
  return message;
}

// find all messages where chatId is the chatId and is ordered by createAt time
export async function getMessages(chatId: string) {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });
  return messages;
}
