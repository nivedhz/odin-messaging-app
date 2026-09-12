"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "./user";
import { getOrCreateDirectChat } from "./direct";

export interface FriendshipActionResponse {
  success: boolean;
  message: string;
  requestId: string | null;
}

async function currentUserId(): Promise<string | undefined> {
  const session = await getSession();
  return session?.userId as string | undefined;
}

export async function handleSendFriendRequest(
  recipientId: string,
): Promise<FriendshipActionResponse> {
  const userId = await currentUserId();
  if (!userId) {
    return { success: false, message: "Log in first.", requestId: null };
  }
  if (userId === recipientId) {
    return {
      success: false,
      message: "You cannot add yourself.",
      requestId: null,
    };
  }

  const request = await sendFriendRequest(userId, recipientId);
  revalidatePath("/chat");
  return { success: true, message: "", requestId: request.id };
}

export async function handleCancelFriendRequest(
  requestId: string,
): Promise<FriendshipActionResponse> {
  const userId = await currentUserId();
  if (!userId) {
    return { success: false, message: "Log in first.", requestId: null };
  }

  await cancelFriendRequest(requestId);
  revalidatePath("/chat");
  return { success: true, message: "", requestId: null };
}

export async function handleAcceptFriendRequest(
  requestId: string,
): Promise<FriendshipActionResponse> {
  const userId = await currentUserId();
  if (!userId) {
    return { success: false, message: "Log in first.", requestId: null };
  }

  await acceptFriendRequest(requestId);
  revalidatePath("/chat");
  return { success: true, message: "", requestId: null };
}

export async function handleOpenDirectChat(formData: FormData) {
  const userId = await currentUserId();
  if (!userId) redirect("/login");

  const friendId = formData.get("friendId")?.toString() ?? "";
  if (!friendId || friendId === userId) redirect("/chat?tab=friends");

  const chat = await getOrCreateDirectChat(userId, friendId);
  if (!chat) redirect("/chat?tab=friends");

  redirect(`/chat?tab=chats&chat=${chat.id}`);
}

export async function handleRejectFriendRequest(
  requestId: string,
): Promise<FriendshipActionResponse> {
  const userId = await currentUserId();
  if (!userId) {
    return { success: false, message: "Log in first.", requestId: null };
  }

  await rejectFriendRequest(requestId);
  revalidatePath("/chat");
  return { success: true, message: "", requestId: null };
}
