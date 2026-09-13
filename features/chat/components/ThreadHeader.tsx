"use client";

import { ArrowLeft } from "lucide-react";
import { avatarGradient } from "./chat-utils";

/**
 * ThreadHeader — the conversation bar: back button (mobile only), letter
 * avatar, and display name. Deliberately minimal — no presence dot, no
 * message count — so the header never implies live data we don't have.
 */
interface ThreadHeaderProps {
  /** Display name of the chat or pending peer. */
  name: string;
  /** Stable key for the avatar gradient (name, falling back to id). */
  avatarKey: string;
  /** Mobile-only back control — clears selection in the parent. */
  onBack: () => void;
}

const ThreadHeader = ({ name, avatarKey, onBack }: ThreadHeaderProps) => {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-6">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/20 hover:text-white md:hidden"
      >
        <ArrowLeft width={16} />
      </button>
      {/* Letter avatar keyed by name so a person keeps one color everywhere. */}
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br text-xs font-bold text-[#1a1333] ${avatarGradient(avatarKey)}`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
          {name}
        </p>
      </div>
    </div>
  );
};

export default ThreadHeader;
