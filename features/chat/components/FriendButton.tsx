"use client";

import { useState } from "react";
import { Check, UserPlus } from "lucide-react";

const FriendButton = ({ username }: { username: string }) => {
  const [requested, setRequested] = useState(false);

  if (requested) {
    return (
      <button
        type="button"
        onClick={() => setRequested(false)}
        title={`Cancel friend request to ${username} (visual only)`}
        className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
      >
        <Check width={14} className="text-emerald-300" />
        Requested
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRequested(true)}
      title={`Send friend request to ${username} (visual only)`}
      className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-brand px-3.5 text-xs font-semibold text-[#1a1333] transition-colors hover:bg-brand/85"
    >
      <UserPlus width={14} />
      Add
    </button>
  );
};

export default FriendButton;
