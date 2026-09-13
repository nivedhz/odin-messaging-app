"use client";

import { avatarGradient } from "./chat-utils";
import type { PeerData } from "./ChatScreen";

interface Props {
  person: PeerData;
  onRecommend: (userId: string) => void;
  disabled?: boolean;
}

const RecommendButton = ({ person, onRecommend, disabled = false }: Props) => {
  return (
    <button
      type="button"
      onClick={() => onRecommend(person.userId)}
      disabled={disabled}
      title={`Chat with ${person.username}`}
      className="shrink-0 cursor-pointer rounded-lg border border-transparent flex flex-col justify-center items-center disabled:cursor-wait disabled:opacity-60"
    >
      <span
        className={`grid size-12 place-items-center rounded-full bg-linear-to-br text-base font-bold text-[#1a1333] ring-2 ring-transparent transition-all group-hover:ring-brand/50 ${avatarGradient(person.username)}`}
      >
        {person.username.charAt(0).toUpperCase()}
      </span>
      <span className="w-full truncate text-center text-[11px] font-medium text-white/60">
        {person.username}
      </span>
    </button>
  );
};

export default RecommendButton;
