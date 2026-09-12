import Navbar from "@/components/Navbar";
import ChatSidebar, {
  SidebarTab,
} from "@/features/chat/components/ChatSidebar";
import ChatThread from "@/features/chat/components/ChatThread";
import { getAllUsers, getUser } from "@/features/chat/user";
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
  const query = (qParam ?? "").trim();
  const needle = query.toLowerCase();
  const tab: SidebarTab =
    tabParam === "people" || tabParam === "friends" ? tabParam : "chats";

  const byUpdatedDesc = [...user.chats].sort(
    (a, b) => +b.updatedAt - +a.updatedAt,
  );

  const sidebarChats = byUpdatedDesc
    .map((chat, index) => {
      const others = chat.members
        .filter((member) => member.id !== user.id)
        .map((member) => member.username);
      const name =
        others.length === 0
          ? "Just you"
          : others.length <= 2
            ? others.join(", ")
            : `${others.slice(0, 2).join(", ")} +${others.length - 2}`;
      const thread = user.messages
        .filter((message) => message.chatId === chat.id)
        .sort((a, b) => +a.createdAt - +b.createdAt);
      return {
        id: chat.id,
        index,
        updatedAt: chat.updatedAt,
        total: thread.length,
        name,
        lastMessage: thread.length
          ? {
              content: thread[thread.length - 1].content,
              createdAt: thread[thread.length - 1].createdAt,
            }
          : null,
      };
    })
    .filter(
      (chat) =>
        !needle ||
        chat.name.toLowerCase().includes(needle) ||
        chat.lastMessage?.content.toLowerCase().includes(needle),
    );

  const allUsers = await getAllUsers();
  const people = allUsers
    .filter((person) => person.id !== user.id)
    .filter(
      (person) =>
        !needle ||
        person.username.toLowerCase().includes(needle) ||
        person.email.toLowerCase().includes(needle),
    )
    .map((person) => ({
      id: person.id,
      username: person.username,
      email: person.email,
    }));

  const activeEntry = sidebarChats.find((chat) => chat.id === chatParam);
  const activeChat = activeEntry
    ? {
        id: activeEntry.id,
        index: activeEntry.index,
        total: activeEntry.total,
        name: activeEntry.name,
      }
    : null;
  const threadMessages = activeChat
    ? user.messages
        .filter((message) => message.chatId === activeChat.id)
        .sort((a, b) => +a.createdAt - +b.createdAt)
    : [];

  return (
    <div className="flex w-full flex-1 flex-col">
      <Navbar username={user.username} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-6 sm:px-6">
        <div className="grid h-[calc(100dvh-12rem)] min-h-110 min-w-0 flex-1 gap-4 lg:grid-cols-[320px_1fr]">
          <aside
            className={`${activeChat ? "hidden" : "flex"} min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 backdrop-blur-2xl md:flex`}
          >
            <ChatSidebar
              chats={sidebarChats}
              users={people}
              tab={tab}
              activeChatId={activeChat?.id ?? null}
              query={query}
              username={user.username}
            />
          </aside>
          <section
            className={`${activeChat ? "flex" : "hidden"} min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 backdrop-blur-2xl md:flex`}
          >
            <ChatThread
              chat={activeChat}
              messages={threadMessages}
              currentUserId={user.id}
              hasChats={user.chats.length > 0}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default page;
