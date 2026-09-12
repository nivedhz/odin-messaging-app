"use client";

import { useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import {
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
} from "../actions";

const FriendRequestActions = ({
  requestId,
  username,
}: {
  requestId: string;
  username: string;
}) => {
  const [pending, startTransition] = useTransition();

  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await handleAcceptFriendRequest(requestId);
          })
        }
        title={`Accept ${username}`}
        className="grid size-8 cursor-pointer place-items-center rounded-full bg-brand text-[#1a1333] transition-colors hover:bg-brand/85 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? (
          <Loader2 width={15} className="animate-spin" />
        ) : (
          <Check width={15} />
        )}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await handleRejectFriendRequest(requestId);
          })
        }
        title={`Decline ${username}`}
        className="grid size-8 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-white/60 transition-colors hover:border-white/25 hover:text-white disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? (
          <Loader2 width={15} className="animate-spin" />
        ) : (
          <X width={15} />
        )}
      </button>
    </span>
  );
};

export default FriendRequestActions;
