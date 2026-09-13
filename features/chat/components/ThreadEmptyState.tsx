"use client";

import { MessagesSquare } from "lucide-react";

/**
 * ThreadEmptyState — the right-pane placeholder when nothing is open.
 *
 * Two moods: "Select a conversation" when chats exist (an actionable hint),
 * "Your inbox is quiet" for brand-new accounts. The pending-thread case
 * never reaches this component — it renders a real (empty) thread instead.
 */
interface ThreadEmptyStateProps {
  /** Whether the user has any chats at all (picks the copy). */
  hasChats: boolean;
}

const ThreadEmptyState = ({ hasChats }: ThreadEmptyStateProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="animate-fade-up grid size-14 place-items-center rounded-3xl border border-white/10 bg-white/5">
        <MessagesSquare width={24} className="text-brand" />
      </span>
      <div className="animate-fade-up delay-100">
        <p className="text-lg font-semibold tracking-[-0.02em] text-white">
          {hasChats ? "Select a conversation" : "Your inbox is quiet"}
        </p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-white/50">
          {hasChats
            ? "Pick a chat from the list to read through your messages."
            : "Your chats and messages will appear here once they exist."}
        </p>
      </div>
    </div>
  );
};

export default ThreadEmptyState;
