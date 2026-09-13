"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ImagePlus,
  MessageCircle,
  MessagesSquare,
  Search,
  Send,
  Smile,
  Users,
  X,
} from "lucide-react";
import {
  avatarGradient,
  dayLabel,
  messageTime,
  monthYear,
  sameDay,
} from "./chat-utils";
import FriendButton from "./FriendButton";
import type { SidebarTab } from "./ChatSidebar";
import RecommendButton from "./RecommendButton";

export interface ChatMessageData {
  id: string;
  content: string;
  createdAt: string;
  creatorId: string;
}

export interface ChatData {
  id: string;
  index: number;
  name: string;
  updatedAt: string;
  members: { id: string; username: string }[];
  messages: ChatMessageData[];
}

export interface PeopleData {
  id: string;
  username: string;
  email: string;
}

export interface PeerData {
  id: string;
  userId: string;
  username: string;
  email: string;
  since?: string;
}

interface ChatScreenProps {
  chats: ChatData[];
  people: PeopleData[];
  suggested: PeerData[];
  sentRecipientIds: string[];
  receivedRequests: PeerData[];
  friends: PeerData[];
  initialTab: SidebarTab;
  initialChatId: string | null;
  initialQuery: string;
  currentUserId: string;
  currentUsername: string;
}

const tabs: { id: SidebarTab; label: string }[] = [
  { id: "chats", label: "Chats" },
  { id: "people", label: "People" },
  { id: "friends", label: "Friends" },
];

const ChatScreen = ({
  chats,
  people,
  suggested,
  sentRecipientIds,
  receivedRequests,
  friends,
  initialTab,
  initialChatId,
  initialQuery,
  currentUserId,
  currentUsername,
}: ChatScreenProps) => {
  // WhatsApp model: everything is already in memory from the first load.
  // Tapping a row just compares its id against the chats array.
  const [activeChatId, setActiveChatId] = useState<string | null>(() =>
    initialChatId && chats.some((chat) => chat.id === initialChatId)
      ? initialChatId
      : (chats[0]?.id ?? null),
  );
  const [tab, setTab] = useState<SidebarTab>(initialTab);
  const [query, setQuery] = useState(initialQuery);

  // Tapping Suggested only toggles the chip UI — no chat is created.
  // The DM gets initialized on first message send (implemented later).
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    string | null
  >(null);
  const allChats = chats;

  const needle = query.trim().toLowerCase();

  const visibleChats = useMemo(
    () =>
      allChats.filter((chat) => {
        const last =
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : null;
        return (
          !needle ||
          chat.name.toLowerCase().includes(needle) ||
          (last?.content.toLowerCase().includes(needle) ?? false)
        );
      }),
    [allChats, needle],
  );

  const visiblePeople = useMemo(
    () =>
      people.filter(
        (person) =>
          !needle ||
          person.username.toLowerCase().includes(needle) ||
          person.email.toLowerCase().includes(needle),
      ),
    [people, needle],
  );

  const activeChat = allChats.find((chat) => chat.id === activeChatId) ?? null;

  // Recommended tap = pure UI toggle on the chip. Nothing is created,
  // nothing is added to the sidebar — creation happens on first send.
  const openRecommendedChat = (userId: string) => {
    setSelectedRecommendation((prev) => (prev === userId ? null : userId));
  };
  // Once a DM exists (including just-created ones), the person leaves Suggested.
  const visibleSuggested = useMemo(
    () =>
      suggested.filter(
        (person) =>
          !allChats.some((chat) =>
            chat.members.some((member) => member.id === person.userId),
          ),
      ),
    [suggested, allChats],
  );

  const activeMessages = useMemo(
    () =>
      activeChat
        ? [...activeChat.messages].sort(
            (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
          )
        : [],
    [activeChat],
  );
  const memberNames = useMemo(() => {
    const names: Record<string, string> = {};
    if (activeChat) {
      for (const member of activeChat.members) {
        names[member.id] = member.username;
      }
    }
    return names;
  }, [activeChat]);

  // Pending thread: tapping Suggested opens the message pane for that
  // person with zero DB writes. The chat only comes into existence when
  // the first message is sent (implemented later).
  const pendingPerson =
    selectedRecommendation !== null
      ? (suggested.find((person) => person.userId === selectedRecommendation) ??
        null)
      : null;
  const threadChat = pendingPerson
    ? {
        id: `pending:${pendingPerson.userId}`,
        index: -1,
        name: pendingPerson.username,
      }
    : activeChat;
  const threadMessages = pendingPerson ? [] : activeMessages;
  const threadMemberNames = pendingPerson
    ? { [pendingPerson.userId]: pendingPerson.username }
    : memberNames;
  return (
    <div className="grid h-[calc(100dvh-12rem)] min-h-110 min-w-0 flex-1 gap-4 lg:grid-cols-[320px_1fr]">
      <aside
        className={`${threadChat ? "hidden" : "flex"} min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 backdrop-blur-2xl md:flex`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 mx-4 mt-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={
                  tab === t.id
                    ? "flex-1 cursor-pointer rounded-xl bg-white/10 px-3 py-1.5 text-center text-[13px] font-semibold text-white"
                    : "flex-1 cursor-pointer rounded-xl px-3 py-1.5 text-center text-[13px] font-medium text-white/50 transition-colors hover:text-white"
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="px-4 pt-3">
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 transition-colors focus-within:border-brand/50 hover:border-white/20">
              <Search width={15} className="shrink-0 text-white/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  tab === "people" ? "Search people…" : "Search conversations…"
                }
                className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
            </label>
          </div>

          <div className="scroll-slim mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {tab === "chats" && visibleSuggested.length > 0 && !needle && (
              <div className="px-1 pt-1 pb-3">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Suggested
                </p>
                <div className="scroll-slim flex gap-3 overflow-x-auto px-1 pb-1">
                  {visibleSuggested.map((person) => (
                    <RecommendButton
                      person={person}
                      key={person.id}
                      onRecommend={openRecommendedChat}
                      active={selectedRecommendation === person.userId}
                    />
                  ))}
                </div>
              </div>
            )}
            {tab === "people" ? (
              visiblePeople.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
                    <Users width={20} className="text-white/40" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {needle ? "No people found" : "Nobody else is here yet"}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/45">
                      {needle
                        ? `No one matches “${query}”.`
                        : "New Sendzy members will show up here."}
                    </p>
                  </div>
                </div>
              ) : (
                visiblePeople.map((person) => (
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
                      initialRequested={sentRecipientIds.includes(person.id)}
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
                      No pending requests. When someone adds you, you can accept
                      or decline here.
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
                          People you add will appear here. Head to People to
                          send your first request.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTab("people")}
                        className="mt-1 cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
                      >
                        Find people
                      </button>
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
                                  {monthYear(new Date(friend.since))}
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
            ) : visibleChats.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
                <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <MessageCircle width={20} className="text-white/40" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {needle ? "No matches found" : "No conversations yet"}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    {needle
                      ? `Nothing in your chats matches “${query}”.`
                      : `When ${currentUsername} joins a chat, it will show up here.`}
                  </p>
                </div>
              </div>
            ) : (
              visibleChats.map((chat) => {
                const last =
                  chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1]
                    : null;
                const isActive = chat.id === activeChatId;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setSelectedRecommendation(null);
                    }}
                    className={
                      isActive
                        ? "flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-left"
                        : "flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition-colors hover:bg-white/5"
                    }
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
                        {last && (
                          <span className="shrink-0 text-[11px] text-white/40">
                            {messageTime(new Date(last.createdAt))}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[13px] text-white/50">
                        {last ? last.content : "No messages yet"}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </aside>
      <section
        className={`${threadChat ? "flex" : "hidden"} min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 backdrop-blur-2xl md:flex`}
      >
        {!threadChat ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="animate-fade-up grid size-14 place-items-center rounded-3xl border border-white/10 bg-white/5">
              <MessagesSquare width={24} className="text-brand" />
            </span>
            <div className="animate-fade-up delay-100">
              <p className="text-lg font-semibold tracking-[-0.02em] text-white">
                {allChats.length > 0
                  ? "Select a conversation"
                  : "Your inbox is quiet"}
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-white/50">
                {allChats.length > 0
                  ? "Pick a chat from the list to read through your messages."
                  : "Your chats and messages will appear here once they exist."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setActiveChatId(null);
                  setSelectedRecommendation(null);
                }}
                aria-label="Back to conversations"
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/20 hover:text-white md:hidden"
              >
                <ArrowLeft width={16} />
              </button>
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br text-xs font-bold text-[#1a1333] ${avatarGradient(threadChat.name || threadChat.id)}`}
              >
                {threadChat.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
                  {threadChat.name}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-white/45">
                  <span className="animate-pulse-dot size-1.5 rounded-full bg-emerald-400" />
                  {threadMessages.length === 1
                    ? "1 message"
                    : `${threadMessages.length} messages`}
                </p>
              </div>
            </div>

            <div className="scroll-slim flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {threadMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="text-sm font-semibold text-white">
                    No messages yet
                  </p>
                  <p className="max-w-60 text-xs leading-relaxed text-white/45">
                    This conversation exists, but nothing has been said here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {threadMessages.map((message, i) => {
                    const createdAt = new Date(message.createdAt);
                    const prev =
                      i > 0
                        ? {
                            ...threadMessages[i - 1],
                            createdAt: new Date(
                              threadMessages[i - 1].createdAt,
                            ),
                          }
                        : null;
                    const isMine = message.creatorId === currentUserId;
                    const senderName = isMine
                      ? "You"
                      : (threadMemberNames[message.creatorId] ?? "Member");
                    const startsGroup =
                      !prev ||
                      prev.creatorId !== message.creatorId ||
                      createdAt.getTime() - prev.createdAt.getTime() >
                        5 * 60 * 1000;
                    const showDay =
                      i === 0 || !sameDay(prev!.createdAt, createdAt);
                    return (
                      <div key={message.id} className="contents">
                        {showDay && (
                          <div className="flex justify-center py-4 first:pt-1">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] font-medium tracking-wide text-white/50">
                              {dayLabel(createdAt)}
                            </span>
                          </div>
                        )}
                        <div
                          className={
                            isMine
                              ? "flex justify-end"
                              : "flex items-end justify-start gap-2"
                          }
                        >
                          {!isMine && (
                            <span
                              aria-hidden="true"
                              className={
                                startsGroup
                                  ? `grid size-7 shrink-0 place-items-center rounded-full bg-linear-to-br text-[10px] font-bold text-[#1a1333] ${avatarGradient(message.creatorId)}`
                                  : "w-7 shrink-0"
                              }
                            >
                              {startsGroup
                                ? senderName.charAt(0).toUpperCase()
                                : ""}
                            </span>
                          )}
                          <div
                            className={
                              isMine
                                ? "flex max-w-[80%] flex-col items-end"
                                : "flex max-w-[80%] flex-col items-start"
                            }
                          >
                            {startsGroup && (
                              <span className="mb-1 text-[11px] font-medium text-white/40">
                                {senderName}
                              </span>
                            )}
                            <p
                              title={messageTime(createdAt)}
                              className={
                                isMine
                                  ? "w-fit rounded-2xl rounded-tr-md bg-brand px-4 py-2.5 text-sm leading-relaxed font-medium text-[#1a1333] shadow-lg shadow-brand/20"
                                  : "w-fit rounded-2xl rounded-tl-md bg-white/10 px-4 py-2.5 text-sm leading-relaxed text-white/90"
                              }
                            >
                              {message.content}
                            </p>
                            {isMine && (
                              <span className="mt-1 flex items-center gap-1 text-[10px] text-white/35">
                                {messageTime(createdAt)}
                                <CheckCheck width={12} className="text-brand" />
                              </span>
                            )}
                            {!isMine &&
                              (i === threadMessages.length - 1 ||
                                threadMessages[i + 1].creatorId !==
                                  message.creatorId) && (
                                <span className="mt-1 text-[10px] text-white/35">
                                  {messageTime(createdAt)}
                                </span>
                              )}
                          </div>
                        </div>
                        {startsGroup && <div className="h-2" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-3.5 sm:px-6">
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="grid size-12 shrink-0 cursor-default place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/40"
                >
                  <ImagePlus width={18} />
                </button>
                <div className="flex flex-1 items-end gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 transition-colors focus-within:border-brand/50">
                  <input
                    type="text"
                    placeholder={`Message ${threadChat.name}…`}
                    aria-label={`Message ${threadChat.name}`}
                    className="max-h-32 min-h-8 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="grid size-8 shrink-0 cursor-default place-items-center rounded-xl text-white/40"
                  >
                    <Smile width={18} />
                  </button>
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  title="Send (not wired yet)"
                  className="grid size-12 shrink-0 cursor-default place-items-center rounded-2xl bg-brand text-[#1a1333] shadow-lg shadow-brand/25"
                >
                  <Send width={17} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatScreen;
