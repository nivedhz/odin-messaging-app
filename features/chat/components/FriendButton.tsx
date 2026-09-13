/**
 * FriendButton — the Add / Requested pill on each row of the People list.
 *
 * Fully working toggle: Add fires `handleSendFriendRequest` and flips to
 * Requested (storing the real request id); Requested fires
 * `handleCancelFriendRequest` and flips back. A spinner locks the pill
 * while a call is in flight, and any failure reverts to the previous
 * visual state so the UI can never disagree with the db.
 */
"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, UserPlus } from "lucide-react";
import {
  handleCancelFriendRequest,
  handleSendFriendRequest,
} from "../actions";

const FriendButton = ({
  username,
  recipientId,
  initialRequested = false,
  initialRequestId = null,
}: {
  username: string;
  /** The other user's id — sent to the server on Add. */
  recipientId: string;
  /** Whether a pending outgoing request already exists (server seed). */
  initialRequested?: boolean;
  /** That request's id, so Cancel can target exactly it. */
  initialRequestId?: string | null;
}) => {
  const [requested, setRequested] = useState(initialRequested);
  const [requestId, setRequestId] = useState<string | null>(initialRequestId);
  // Transition keeps the tap responsive; `pending` drives the spinner.
  const [pending, startTransition] = useTransition();

  const send = () => {
    startTransition(async () => {
      const result = await handleSendFriendRequest(recipientId);
      // Null = server refused (dupe, self, logged out): stay on Add.
      if (result) {
        setRequestId(result.requestId);
        setRequested(true);
      }
    });
  };

  const cancel = () => {
    // No id (shouldn't happen) → just drop back to Add visually.
    if (!requestId) {
      setRequested(false);
      return;
    }
    const id = requestId;
    startTransition(async () => {
      const result = await handleCancelFriendRequest(id);
      // Only flip back on confirmed delete; otherwise hold Requested.
      if (result.success) {
        setRequestId(null);
        setRequested(false);
      }
    });
  };

  if (requested) {
    return (
      <button
        type="button"
        onClick={cancel}
        disabled={pending}
        title={`Cancel friend request to ${username}`}
        className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? (
          <Loader2 width={14} className="animate-spin" />
        ) : (
          <Check width={14} className="text-emerald-300" />
        )}
        Requested
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={send}
      disabled={pending}
      title={`Send friend request to ${username}`}
      className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-brand px-3.5 text-xs font-semibold text-[#1a1333] transition-colors hover:bg-brand/85 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? (
        <Loader2 width={14} className="animate-spin" />
      ) : (
        <UserPlus width={14} />
      )}
      Add
    </button>
  );
};

export default FriendButton;
