"use client";

import { CheckCheck } from "lucide-react";
import { avatarGradient, messageTime } from "./chat-utils";

/**
 * MessageBubble — one message with its grouping chrome.
 *
 * Layout contract (WhatsApp model):
 * - Own messages align end (`flex-end`) in a brand bubble with dark text
 *   plus a clock tick + read check underneath.
 * - Their messages align start (`flex-start`) in a bordered glass bubble.
 * - `startsGroup` (new sender or >5min gap, computed by MessageList) gates
 *   the sender label, the avatar dot, and the spacer that separates groups.
 *   The avatar dot reserves a fixed `w-7` gutter even mid-group so text
 *   columns stay aligned.
 */
interface MessageBubbleProps {
  /** Message text. */
  content: string;
  /** ISO timestamp — parsed once here for every display use. */
  createdAt: string;
  /** True when the signed-in user wrote this message. */
  isMine: boolean;
  /** Resolved display name ("You" for own messages). */
  senderName: string;
  /** Stable key for the avatar gradient (the sender's id). */
  senderKey: string;
  /** First message of a sender/time block — shows label + avatar. */
  startsGroup: boolean;
  /** Last message of a sender block — shows the clock tick for theirs. */
  endsGroup: boolean;
}

const MessageBubble = ({
  content,
  createdAt,
  isMine,
  senderName,
  senderKey,
  startsGroup,
  endsGroup,
}: MessageBubbleProps) => {
  const createdAtDate = new Date(createdAt);

  return (
    <div>
      <div
        className={
          isMine ? "flex justify-end" : "flex items-end justify-start gap-2"
        }
      >
        {!isMine && (
          <span
            aria-hidden="true"
            className={
              startsGroup
                ? `grid size-7 shrink-0 place-items-center rounded-full bg-linear-to-br text-[10px] font-bold text-[#1a1333] ${avatarGradient(senderKey)}`
                : "w-7 shrink-0"
            }
          >
            {startsGroup ? senderName.charAt(0).toUpperCase() : ""}
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
            title={messageTime(createdAtDate)}
            className={
              isMine
                ? "w-fit max-w-full rounded-2xl rounded-tr-md bg-brand px-4 py-2.5 text-sm leading-relaxed font-medium break-words text-[#1a1333] shadow-lg shadow-brand/20"
                : "w-fit max-w-full rounded-2xl rounded-tl-md border border-white/10 bg-white/10 px-4 py-2.5 text-sm leading-relaxed break-words text-white"
            }
          >
            {content}
          </p>
          {isMine && (
            <span className="mt-1 flex items-center gap-1 text-[10px] text-white/35">
              {messageTime(createdAtDate)}
              <CheckCheck width={12} className="text-brand" />
            </span>
          )}
          {!isMine && endsGroup && (
            <span className="mt-1 text-[10px] text-white/35">
              {messageTime(createdAtDate)}
            </span>
          )}
        </div>
      </div>
      {startsGroup && <div className="h-2" />}
    </div>
  );
};

export default MessageBubble;
