import Link from "next/link";
import { MessageCircle, Search, Users } from "lucide-react";
import { avatarGradient, messageTime } from "./chat-utils";
import FriendButton from "./FriendButton";

export interface SidebarChat {
  id: string;
  index: number;
  updatedAt: Date;
  total: number;
  name: string;
  lastMessage: { content: string; createdAt: Date } | null;
}

export interface SidebarUser {
  id: string;
  username: string;
  email: string;
}

export type SidebarTab = "chats" | "people" | "friends";

interface ChatSidebarProps {
  chats: SidebarChat[];
  users: SidebarUser[];
  tab: SidebarTab;
  activeChatId: string | null;
  query: string;
  username: string;
}

const tabs: { id: SidebarTab; label: string }[] = [
  { id: "chats", label: "Chats" },
  { id: "people", label: "People" },
  { id: "friends", label: "Friends" },
];

const ChatSidebar = ({
  chats,
  users,
  tab,
  activeChatId,
  query,
  username,
}: ChatSidebarProps) => {
  const tabHref = (next: SidebarTab) => {
    const params = new URLSearchParams();
    params.set("tab", next);
    if (activeChatId) params.set("chat", activeChatId);
    if (query) params.set("q", query);
    return `/chat?${params.toString()}`;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 mx-4 mt-4">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={tabHref(t.id)}
            className={
              tab === t.id
                ? "flex-1 rounded-xl bg-white/10 px-3 py-1.5 text-center text-[13px] font-semibold text-white"
                : "flex-1 rounded-xl px-3 py-1.5 text-center text-[13px] font-medium text-white/50 transition-colors hover:text-white"
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      <form action="/chat" method="get" className="px-4 pt-3">
        <input type="hidden" name="tab" value={tab} />
        {activeChatId && (
          <input type="hidden" name="chat" value={activeChatId} />
        )}
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 transition-colors focus-within:border-brand/50 hover:border-white/20">
          <Search width={15} className="shrink-0 text-white/40" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={
              tab === "people" ? "Search people…" : "Search conversations…"
            }
            className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
        </label>
      </form>

      <div className="scroll-slim mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {tab === "people" ? (
          users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
                <Users width={20} className="text-white/40" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  {query ? "No people found" : "Nobody else is here yet"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/45">
                  {query
                    ? `No one matches “${query}”.`
                    : "New Sendzy members will show up here."}
                </p>
              </div>
            </div>
          ) : (
            users.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors hover:bg-white/5"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-[#1a1333] ${avatarGradient(person.username)}`}
                >
                  {person.username.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-white">
                    {person.username}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">
                    {person.email}
                  </span>
                </span>
                <FriendButton username={person.username} />
              </div>
            ))
          )
        ) : tab === "friends" ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Users width={20} className="text-white/40" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">No friends yet</p>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                People you add will appear here. Head to People to send your
                first request.
              </p>
            </div>
            <Link
              href={tabHref("people")}
              className="mt-1 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              Find people
            </Link>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <MessageCircle width={20} className="text-white/40" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                {query ? "No matches found" : "No conversations yet"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                {query
                  ? `Nothing in your chats matches “${query}”.`
                  : `When ${username} joins a chat, it will show up here.`}
              </p>
            </div>
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <Link
                key={chat.id}
                href={`/chat?tab=chats&chat=${chat.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                className={
                  isActive
                    ? "flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-3"
                    : "flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 transition-colors hover:bg-white/5"
                }
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-[#1a1333] ${avatarGradient(chat.name || chat.id)}`}
                >
                  {chat.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold tracking-[-0.01em] text-white">
                      {chat.name}
                    </span>
                    {chat.lastMessage && (
                      <span className="shrink-0 text-[11px] text-white/40">
                        {messageTime(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[13px] text-white/50">
                    {chat.lastMessage
                      ? chat.lastMessage.content
                      : "No messages yet"}
                  </span>
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
