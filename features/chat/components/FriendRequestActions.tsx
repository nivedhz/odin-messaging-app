"use client";

import { useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import {
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
} from "../actions";

/**
 * FriendRequestActions — the accept (check) / decline (X) buttons on one
 * inbound request row.
 *
 * Each button fires its server action and reports the confirmed outcome
 * through `onDecided` so the parent can move or drop the row instantly.
 * Both lock with a spinner while in flight; a refused call leaves the row
 * exactly as it was (no silent state drift).
 */
interface FriendRequestActionsProps {
  /** Friendship row id — the only thing the server needs. */
  requestId: string;
  /** Sender name, for accessible button labels. */
  username: string;
  /** Parent callback — fires only after the server confirms. */
  onDecided: (outcome: "accepted" | "declined") => void;
}

const FriendRequestActions = ({
  requestId,
  username,
  onDecided,
}: FriendRequestActionsProps) => {
  // Transition keeps the tap responsive; `pending` locks both buttons.
  const [pending, startTransition] = useTransition();

  const decide = (outcome: "accepted" | "declined") => {
    startTransition(async () => {
      const result =
        outcome === "accepted"
          ? await handleAcceptFriendRequest(requestId)
          : await handleRejectFriendRequest(requestId);
      if (result.success) onDecided(outcome);
    });
  };

  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={() => decide("accepted")}
        disabled={pending}
        title={`Accept ${username}`}
        aria-label={`Accept friend request from ${username}`}
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
        onClick={() => decide("declined")}
        disabled={pending}
        title={`Decline ${username}`}
        aria-label={`Decline friend request from ${username}`}
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
