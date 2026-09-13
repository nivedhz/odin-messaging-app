"use server";

import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { getOrCreateDirectChat } from "./direct";

export interface RecommendedChatData {
  id: string;
  name: string;
  updatedAt: string;
  members: { id: string; username: string }[];
}

export async function handleOpenRecommendedChat(
  friendId: string,
): Promise<RecommendedChatData | null> {
  const session = await getSession();
  const userId = session?.userId as string | undefined;
  if (!userId || !friendId || friendId === userId) return null;

  const chat = await getOrCreateDirectChat(userId, friendId);
  if (!chat) return null;

  const members = await prisma.user.findMany({
    where: { id: { in: [userId, friendId] } },
    select: { id: true, username: true },
  });

  return {
    id: chat.id,
    name: chat.name,
    updatedAt: chat.updatedAt.toISOString(),
    members,
  };
}
