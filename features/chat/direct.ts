"use server";
import prisma from "@/lib/db";

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
