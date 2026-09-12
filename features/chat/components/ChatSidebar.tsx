import Link from "next/link";
import { Check, MessageCircle, Search, Users, X } from "lucide-react";
import { avatarGradient, messageTime, monthYear } from "./chat-utils";
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

export interface SidebarPeer {
  id: string;
  userId: string;
  username: string;
  email: string;
  since?: Date;
}

interface ChatSidebarProps {
  chats: SidebarChat[];
  users: SidebarUser[];
  suggested: SidebarPeer[];
  sentRequests: { recipientId: string; requestId: string }[];
  receivedRequests: SidebarPeer[];
  friends: SidebarPeer[];
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
  suggested,
  sentRequests,
  receivedRequests,
  friends,
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
  console.log(suggested);
  console.log(friends);

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
        {tab === "chats" && suggested.length > 0 && !query && (
          <div className="px-1 pt-1 pb-3">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Suggested
            </p>
            <div className="scroll-slim flex gap-1 overflow-x-auto pb-1">
              {suggested.map((chat) => (
                <div
                  key={chat.id}
                  className="shrink-0 rounded-lg border border-transparent flex flex-col justify-center items-center"
                >
                  <span
                    className={`grid size-12 place-items-center rounded-full bg-linear-to-br text-base font-bold text-[#1a1333] ring-2 ring-transparent transition-all group-hover:ring-brand/50 ${avatarGradient(chat.username)}`}
                  >
                    {chat.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="w-full truncate text-center text-[11px] font-medium text-white/60">
                    {chat.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-[#1a1333] ${avatarGradient(person.username)}`}
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
                <FriendButton
                  username={person.username}
                  initialRequested={
                    !!sentRequests.find(
                      (request) => request.recipientId === person.id,
                    )
                  }
                />
              </div>
            ))
          )
        ) : tab === "friends" ? (
          <div className="flex flex-col gap-5 px-1 pb-4">
            <div>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Requests · {receivedRequests.length}
              </p>
              {receivedRequests.length === 0 ? (
                <p className="px-2 pt-2 text-xs leading-relaxed text-white/45">
                  No pending requests. When someone adds you, you can accept or
                  decline here.
                </p>
              ) : (
                <div className="mt-2 space-y-1">
                  {receivedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5"
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br text-xs font-bold text-[#1a1333] ${avatarGradient(request.username)}`}
                      >
                        {request.username.charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-white">
                          {request.username}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-white/45">
                          Wants to be friends
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span
                          title={`Accept ${request.username} (visual only)`}
                          className="grid size-8 place-items-center rounded-full bg-brand text-[#1a1333]"
                        >
                          <Check width={15} />
                        </span>
                        <span
                          title={`Decline ${request.username} (visual only)`}
                          className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/5 text-white/60"
                        >
                          <X width={15} />
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Friends · {friends.length}
              </p>
              {friends.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
                    <Users width={20} className="text-white/40" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      No friends yet
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/45">
                      People you add will appear here. Head to People to send
                      your first request.
                    </p>
                  </div>
                  <Link
                    href={tabHref("people")}
                    className="mt-1 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
                  >
                    Find people
                  </Link>
                </div>
              ) : (
                <div className="mt-2 space-y-1">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors hover:bg-white/5"
                    >
                      <span
                        title={`Chat with ${friend.username} (visual only)`}
                        className="group flex w-full items-center gap-3 bg-transparent px-0 py-0 text-left"
                      >
                        <span
                          className={`grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-[#1a1333] ${avatarGradient(friend.username)}`}
                        >
                          {friend.username.charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-white">
                            {friend.username}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-white/45">
                            {friend.email}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2 text-white/40">
                          {friend.since && (
                            <span className="hidden text-[11px] xl:block">
                              {monthYear(friend.since)}
                            </span>
                          )}
                          <span className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-white/25">
                            <MessageCircle width={15} />
                          </span>
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            return (
              <div
                key={chat.id}
                className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3"
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-[#1a1333] ${avatarGradient(chat.name || chat.id)}`}
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
