"use client";

import { Fragment } from "react";
import { dayLabel, sameDay } from "./chat-utils";
import MessageBubble from "./MessageBubble";
import type { ChatMessageData } from "./chat-types";

/**
 * MessageList — the scrollable thread: day dividers + grouped bubbles.
 *
 * Grouping rule: a message starts a new visual group when the sender
 * changes or more than 5 minutes pass since the previous message. Day
 * dividers ("Today" / "Yesterday" / date) split calendar days. Messages
 * must arrive oldest-first; sorting is the parent's job.
 */
interface MessageListProps {
  /** Thread messages, oldest first. */
  messages: ChatMessageData[];
  /** Id of the signed-in user (own vs theirs alignment). */
  currentUserId: string;
  /** Sender id → display name ("You" is resolved here, not in data). */
  memberNames: Record<string, string>;
  /** Overrides the empty-thread hint (used for pending threads). */
  emptyHint?: string;
}

const GROUP_GAP_MS = 5 * 60 * 1000;

const MessageList = ({
  messages,
  currentUserId,
  memberNames,
  emptyHint = "This conversation exists, but nothing has been said here.",
}: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-white">No messages yet</p>
        <p className="max-w-60 text-xs leading-relaxed text-white/45">
          {emptyHint}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {messages.map((message, i) => {
        const createdAt = new Date(message.createdAt);
        const prev = i > 0 ? new Date(messages[i - 1].createdAt) : null;
        const prevSender = i > 0 ? messages[i - 1].creatorId : null;
        const isMine = message.creatorId === currentUserId;
        // "You" for own messages; member map for theirs; never blank.
        const senderName = isMine
          ? "You"
          : (memberNames[message.creatorId] ?? "Member");
        const startsGroup =
          prev === null ||
          prevSender !== message.creatorId ||
          createdAt.getTime() - prev.getTime() > GROUP_GAP_MS;
        const nextSender =
          i < messages.length - 1 ? messages[i + 1].creatorId : null;
        const endsGroup = nextSender !== message.creatorId;
        const showDay = i === 0 || (prev !== null && !sameDay(prev, createdAt));

        return (
          <Fragment key={message.id}>
            {showDay && (
              <div className="flex justify-center py-4 first:pt-1">
                <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] font-medium tracking-wide text-white/50">
                  {dayLabel(createdAt)}
                </span>
              </div>
            )}
            <MessageBubble
              content={message.content}
              createdAt={message.createdAt}
              isMine={isMine}
              senderName={senderName}
              senderKey={message.creatorId}
              startsGroup={startsGroup}
              endsGroup={endsGroup}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default MessageList;
