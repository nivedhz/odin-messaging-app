"use client";

import { avatarGradient, smartTime } from "./chat-utils";
import type { ChatData, ChatMessageData } from "./chat-types";

/**
 * ChatListItem — one conversation row: avatar, name, last-message preview
 * with sender + smart timestamp.
 *
 * The preview line reads "You: …" for your own messages and
 * "<username>: …" for theirs, so ownership is scannable without opening
 * the thread. Tapping calls `onOpen` with the chat id — the parent flips
 * `activeChatId` state, which is the entire "switching" mechanism (no
 * navigation, no refetch). The active row gets the highlighted treatment.
 */
interface ChatListItemProps {
  /** Chat row data (name already derived server-side from members). */
  chat: ChatData;
  /** Live message list for this chat (fresh server data wins over initial). */
  messages: ChatMessageData[];
  /** Sender id → display name for this chat ("You" is resolved by parent). */
  memberNames: Record<string, string>;
  /** Id of the signed-in user, to tell own messages apart. */
  currentUserId: string;
  /** Whether this row is the open thread (highlighted, no hover shift). */
  active: boolean;
  /** Parent handler — receives this chat's id on tap. */
  onOpen: (chatId: string) => void;
}

const ChatListItem = ({
  chat,
  messages,
  memberNames,
  currentUserId,
  active,
  onOpen,
}: ChatListItemProps) => {
  // Newest message drives both preview text and stamp; threads are
  // oldest-first so the tail is the latest.
  const last = messages.length > 0 ? messages[messages.length - 1] : null;
  // Sender label: your own messages read "You", anything else resolves
  // through the member map (unknown ids degrade to "Member", never blank).
  const lastSender = last
    ? last.creatorId === currentUserId
      ? "You"
      : (memberNames[last.creatorId] ?? "Member")
    : null;

  return (
    <button
      type="button"
      onClick={() => onOpen(chat.id)}
      className={
        active
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
              {smartTime(new Date(last.createdAt))}
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-white/50">
          {last && lastSender
            ? `${lastSender}: ${last.content}`
            : "No messages yet"}
        </span>
      </span>
    </button>
  );
};

export default ChatListItem;
