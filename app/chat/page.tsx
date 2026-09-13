import Navbar from "@/components/Navbar";
import ChatScreen from "@/features/chat/components/ChatScreen";
import type { SidebarTab } from "@/features/chat/components/ChatSidebar";
import {
  getAllUsers,
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  getUser,
} from "@/features/chat/user";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ chat?: string; q?: string; tab?: string }>;
}) => {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  const user = await getUser(session.userId as string);
  if (!user) redirect("/login");

  const { chat: chatParam, q: qParam, tab: tabParam } = await searchParams;
  const tab: SidebarTab =
    tabParam === "people" || tabParam === "friends" ? tabParam : "chats";

  const byUpdatedDesc = [...user.chats].sort(
    (a, b) => +b.updatedAt - +a.updatedAt,
  );

  const chats = byUpdatedDesc.map((chat, index) => {
    const others = chat.members
      .filter((member) => member.id !== user.id)
      .map((member) => member.username);
    const thread = user.messages
      .filter((message) => message.chatId === chat.id)
      .sort((a, b) => +a.createdAt - +b.createdAt);
    return {
      id: chat.id,
      index,
      name:
        others.length === 0
          ? "Just you"
          : others.length <= 2
            ? others.join(", ")
            : `${others.slice(0, 2).join(", ")} +${others.length - 2}`,
      updatedAt: chat.updatedAt.toISOString(),
      members: chat.members.map((member) => ({
        id: member.id,
        username: member.username,
      })),
      messages: thread.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        creatorId: message.creatorId,
      })),
    };
  });

  const initialChatId =
    chatParam && chats.some((chat) => chat.id === chatParam) ? chatParam : null;

  const allUsers = await getAllUsers(user.id);
  const people = allUsers.map((person) => ({
    id: person.id,
    username: person.username,
    email: person.email,
  }));

  const [sentRequests, receivedRequests, friendships] = await Promise.all([
    getSentFriendRequests(user.id),
    getReceivedFriendRequests(user.id),
    getFriends(user.id),
  ]);

  const userById = new Map(allUsers.map((person) => [person.id, person]));
  const sentRecipientIds = sentRequests.map((request) => request.recipientId);
  const received = receivedRequests.map((request) => {
    const sender = userById.get(request.requesterId);
    return {
      id: request.id,
      userId: request.requesterId,
      username: sender?.username ?? "Unknown",
      email: sender?.email ?? "",
    };
  });
  const friends = friendships.map((friendship) => {
    const other =
      friendship.requester.id === user.id
        ? friendship.recipient
        : friendship.requester;
    return {
      id: other.id,
      userId: other.id,
      username: other.username,
      email: other.email,
    };
  });

  const chattedIds = new Set(
    user.chats.flatMap((chat) =>
      chat.members.map((member) => member.id).filter((id) => id !== user.id),
    ),
  );
  const suggested = friends
    .filter((friend) => !chattedIds.has(friend.userId))
    .slice(0, 8);

  return (
    <div className="flex w-full flex-1 flex-col">
      <Navbar username={user.username} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-6 sm:px-6">
        <ChatScreen
          chats={chats}
          people={people}
          suggested={suggested}
          sentRecipientIds={sentRecipientIds}
          receivedRequests={received}
          friends={friends}
          initialTab={tab}
          initialChatId={initialChatId}
          initialQuery={(qParam ?? "").trim()}
          currentUserId={user.id}
          currentUsername={user.username}
        />
      </main>
    </div>
  );
};

export default page;
