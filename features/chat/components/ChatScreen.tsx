"use client";

import { useMemo, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatListItem from "./ChatListItem";
import FriendsPanel from "./FriendsPanel";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import PeopleList from "./PeopleList";
import SidebarSearch from "./SidebarSearch";
import SidebarTabs from "./SidebarTabs";
import SuggestedStrip from "./SuggestedStrip";
import ThreadEmptyState from "./ThreadEmptyState";
import ThreadHeader from "./ThreadHeader";
import { lastActivity } from "./chat-utils";
import {
  handleGetMessages,
  handleSendFirstMessage,
  handleSendMessage,
} from "../actions";
import type {
  ChatData,
  ChatMessageData,
  PeerData,
  PeopleData,
  PendingPeer,
  SidebarTab,
} from "./chat-types";

/**
 * ChatScreen — the stateful chat shell (WhatsApp model).
 *
 * Data flow, in one place:
 * 1. The server page loads EVERYTHING once (`getUser()` + friends reads)
 *    and passes it in as props. No fetching happens after mount except
 *    per-thread refreshes (see `openChat`) and sends.
 * 2. `activeChatId` state picks the open thread; tapping a row only flips
 *    this id and compares it against the in-memory `chatList` — switching
 *    is instant, with zero navigation and zero refetch.
 * 3. Tapping a person with no DM stages `pendingPeer`: the thread pane
 *    transforms, but nothing is created in the db until the first message
 *    is sent (`send` → `handleSendFirstMessage`), which then prepends the
 *    real chat and activates it.
 * 4. `freshMessages` overlays server-fresh history on top of the initial
 *    load, keyed by chat id. Sends append into the same map, so the UI
 *    never waits on a roundtrip to display its own message.
 */
interface ChatScreenProps {
  /** All chats with members + full history, newest chats first. */
  chats: ChatData[];
  /** Discoverable users for the People tab. */
  people: PeopleData[];
  /** Friends without a DM yet, for the Suggested rail. */
  suggested: PeerData[];
  /** Recipient ids with a pending outgoing request (pill state). */
  sentRecipientIds: string[];
  /** Pending inbound requests with sender profiles. */
  receivedRequests: PeerData[];
  /** Accepted friends. */
  friends: PeerData[];
  /** Tab to open on (from the `?tab=` param). */
  initialTab: SidebarTab;
  /** Chat to open on (from `?chat=`, if it exists). */
  initialChatId: string | null;
  /** Initial search text (from `?q=`). */
  initialQuery: string;
  /** Signed-in user id (own-vs-theirs everywhere). */
  currentUserId: string;
  /** Signed-in username (empty-state copy). */
  currentUsername: string;
}

const ChatScreen = ({
  chats: initialChats,
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
  // Local mirror of the chat list so first-sends can prepend new chats.
  const [chatList, setChatList] = useState<ChatData[]>(initialChats);
  // Server-fresh history overlay, keyed by chat id (see `openChat`).
  const [freshMessages, setFreshMessages] = useState<
    Record<string, ChatMessageData[]>
  >(() => Object.fromEntries(initialChats.map((c) => [c.id, c.messages])));
  // The entire switching mechanism: one id, compared against `chatList`.
  const [activeChatId, setActiveChatId] = useState<string | null>(() =>
    initialChatId && initialChats.some((chat) => chat.id === initialChatId)
      ? initialChatId
      : (initialChats[0]?.id ?? null),
  );
  const [tab, setTab] = useState<SidebarTab>(initialTab);
  const [query, setQuery] = useState(initialQuery);
  // Staged person with no DM yet — transforms the pane, creates nothing.
  const [pendingPeer, setPendingPeer] = useState<PendingPeer | null>(null);
  // Composer draft lives here so sending + emoji insertion share it.
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  // Caret handle for emoji insertion (owned by the composer input).
  const inputRef = useRef<HTMLInputElement>(null);

  const needle = query.trim().toLowerCase();

  /** Live messages for a chat: fresh overlay wins, initial load is fallback. */
  const messagesFor = (chatId: string): ChatMessageData[] =>
    freshMessages[chatId] ??
    chatList.find((chat) => chat.id === chatId)?.messages ??
    [];

  /** Sender id → username for one chat (owns the "You"/name labels). */
  const memberNamesFor = (chatId: string): Record<string, string> => {
    const names: Record<string, string> = {};
    for (const member of chatList.find((chat) => chat.id === chatId)?.members ??
      []) {
      names[member.id] = member.username;
    }
    return names;
  };

  // Sidebar order: most recently active first. Activity = the newest
  // message if the thread has any, otherwise the chat's own updatedAt.
  // Sorting here (not in render) keeps the list stable across renders,
  // and because it reads `freshMessages`, a just-sent message bumps its
  // chat to the top instantly with no refetch.
  const visibleChats = useMemo(
    () =>
      chatList
        .filter((chat) => {
          const messages = freshMessages[chat.id] ?? chat.messages;
          const last =
            messages.length > 0 ? messages[messages.length - 1] : null;
          return (
            !needle ||
            chat.name.toLowerCase().includes(needle) ||
            (last?.content.toLowerCase().includes(needle) ?? false)
          );
        })
        .sort(
          (a, b) =>
            +new Date(
              lastActivity(
                freshMessages[b.id] ?? b.messages,
                b.updatedAt,
              ),
            ) -
            +new Date(
              lastActivity(
                freshMessages[a.id] ?? a.messages,
                a.updatedAt,
              ),
            ),
        ),
    [chatList, freshMessages, needle],
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

  // A friend leaves Suggested the moment any DM with them exists.
  const visibleSuggested = useMemo(
    () =>
      suggested.filter(
        (person) =>
          !chatList.some((chat) =>
            chat.members.some((member) => member.id === person.userId),
          ),
      ),
    [suggested, chatList],
  );

  /**
   * Opens a thread AND refreshes its history from the server, so the pane
   * never shows stale data. Empty results keep the old messages (a blank
   * reply means "nothing new", not "delete what we have").
   */
  const openChat = (id: string) => {
    setActiveChatId(id);
    setPendingPeer(null);
    handleGetMessages(id).then((messages) => {
      if (messages.length === 0) return;
      setFreshMessages((prev) => ({ ...prev, [id]: messages }));
    });
  };

  /**
   * Tapping a person: open their existing DM when there is one, otherwise
   * stage them as pending (pane transforms, db untouched). Tapping the
   * staged person again unstages them.
   */
  const openPerson = (peer: PeerData) => {
    const existing = chatList.find((chat) =>
      chat.members.some((member) => member.id === peer.userId),
    );
    if (existing) {
      openChat(existing.id);
      return;
    }
    setPendingPeer((prev) =>
      prev?.userId === peer.userId
        ? null
        : { userId: peer.userId, username: peer.username },
    );
    setActiveChatId(null);
  };

  /** Splices an emoji into the draft at the caret, then restores focus. */
  const insertEmoji = (emoji: string) => {
    const el = inputRef.current;
    if (!el) {
      setDraft((d) => d + emoji);
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const next = draft.slice(0, start) + emoji + draft.slice(end);
    setDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  /**
   * Send flow. Pending pane → one action creates the DM AND sends the
   * message; the new chat is prepended and activated from the response.
   * Open thread → plain append. Null responses (invalid send) leave all
   * local state untouched and keep the draft.
   */
  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      if (pendingPeer) {
        const result = await handleSendFirstMessage(pendingPeer.userId, text);
        if (result) {
          const created: ChatData = {
            id: result.chat.id,
            index: chatList.length,
            name: result.chat.name,
            updatedAt: result.chat.updatedAt,
            members: result.chat.members,
            messages: [],
          };
          setChatList((prev) =>
            prev.some((chat) => chat.id === created.id)
              ? prev
              : [created, ...prev],
          );
          setFreshMessages((prev) => ({
            ...prev,
            [result.chat.id]: [result.message],
          }));
          setPendingPeer(null);
          setActiveChatId(result.chat.id);
          setDraft("");
        }
      } else if (activeChatId) {
        const message = await handleSendMessage(activeChatId, text);
        if (message) {
          setFreshMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] ?? []), message],
          }));
          setDraft("");
        }
      }
    } finally {
      setSending(false);
    }
  };

  const activeChat = chatList.find((chat) => chat.id === activeChatId) ?? null;
  // The pane shows either the staged pending person or the open chat.
  // A pending id can never collide with a real one (`pending:` prefix).
  const threadChat = pendingPeer
    ? {
        id: `pending:${pendingPeer.userId}`,
        index: -1,
        name: pendingPeer.username,
      }
    : activeChat;
  const threadMessages = pendingPeer
    ? []
    : activeChatId
      ? [...messagesFor(activeChatId)].sort(
          (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
        )
      : [];
  const threadMemberNames = pendingPeer
    ? { [pendingPeer.userId]: pendingPeer.username }
    : activeChatId
      ? memberNamesFor(activeChatId)
      : {};

  return (
    <div className="grid h-[calc(100dvh-12rem)] min-h-110 min-w-0 flex-1 gap-4 lg:grid-cols-[320px_1fr]">
      {/* Left pane: hidden on mobile while a thread is open. */}
      <aside
        className={`${threadChat ? "hidden" : "flex"} min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 backdrop-blur-2xl md:flex`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <SidebarTabs tab={tab} onChange={setTab} />
          <SidebarSearch
            value={query}
            onChange={setQuery}
            placeholder={
              tab === "people" ? "Search people…" : "Search conversations…"
            }
          />

          <div className="scroll-slim mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {tab === "chats" && visibleSuggested.length > 0 && !needle && (
              <SuggestedStrip
                people={visibleSuggested}
                activeUserId={pendingPeer?.userId ?? null}
                onRecommend={(person) =>
                  openPerson({
                    id: person.id,
                    userId: person.userId,
                    username: person.username,
                    email: person.email,
                  })
                }
              />
            )}
            {tab === "people" ? (
              <PeopleList
                people={visiblePeople}
                sentRecipientIds={sentRecipientIds}
                query={query}
              />
            ) : tab === "friends" ? (
              <FriendsPanel
                receivedRequests={receivedRequests}
                friends={friends}
                activeUserId={pendingPeer?.userId ?? null}
                onChatWith={(friend) =>
                  openPerson({
                    id: friend.id,
                    userId: friend.userId,
                    username: friend.username,
                    email: friend.email,
                  })
                }
                onFindPeople={() => setTab("people")}
              />
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
              visibleChats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  messages={messagesFor(chat.id)}
                  memberNames={memberNamesFor(chat.id)}
                  currentUserId={currentUserId}
                  active={chat.id === activeChatId && pendingPeer === null}
                  onOpen={openChat}
                />
              ))
            )}
          </div>
        </div>
      </aside>
      {/* Right pane: thread, or the empty-state placeholder. */}
      <section
        className={`${threadChat ? "flex" : "hidden"} min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 backdrop-blur-2xl md:flex`}
      >
        {!threadChat ? (
          <ThreadEmptyState hasChats={chatList.length > 0} />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <ThreadHeader
              name={threadChat.name}
              avatarKey={threadChat.name || threadChat.id}
              onBack={() => {
                setActiveChatId(null);
                setPendingPeer(null);
              }}
            />
            <div className="scroll-slim flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <MessageList
                messages={threadMessages}
                currentUserId={currentUserId}
                memberNames={threadMemberNames}
                emptyHint={
                  pendingPeer
                    ? `Say hello to ${pendingPeer.username} — sending your first message starts the chat.`
                    : undefined
                }
              />
            </div>
            <MessageComposer
              chatName={threadChat.name}
              draft={draft}
              onDraftChange={setDraft}
              inputRef={inputRef}
              onPickEmoji={insertEmoji}
              sending={sending}
              onSend={send}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatScreen;
