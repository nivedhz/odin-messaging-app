/**
 * RecommendButton — one tappable avatar chip in the Suggested strip.
 *
 * A client component because the tap is stateful UI: it calls `onRecommend`
 * (owned by ChatScreen) which stages a pending thread without creating
 * anything in the db. `active` drives the brand-ring selection indicator.
 */
"use client";

import { avatarGradient } from "./chat-utils";
import type { PeerData } from "./chat-types";

interface Props {
  person: PeerData;
  /** Fired on tap — the parent decides what staging a thread means. */
  onRecommend: () => void;
  active?: boolean;
}

const RecommendButton = ({ person, onRecommend, active = false }: Props) => {
  return (
    <button
      type="button"
      onClick={onRecommend}
      title={`Chat with ${person.username}`}
      aria-pressed={active}
      className={
        active
          ? "shrink-0 cursor-pointer rounded-2xl border border-brand/60 bg-brand/10 flex flex-col justify-center items-center px-4 py-3"
          : "shrink-0 cursor-pointer rounded-2xl border border-transparent flex flex-col justify-center items-center px-4 py-3"
      }
    >
      <span
        className={`grid size-12 place-items-center rounded-full bg-linear-to-br text-base font-bold text-[#1a1333] ring-2 transition-all ${active ? "ring-brand" : "ring-transparent"} ${avatarGradient(person.username)}`}
      >
        {person.username.charAt(0).toUpperCase()}
      </span>
      <span
        className={
          active
            ? "w-full truncate text-center text-[11px] font-semibold text-white"
            : "w-full truncate text-center text-[11px] font-medium text-white/60"
        }
      >
        {person.username}
      </span>
    </button>
  );
};

export default RecommendButton;
