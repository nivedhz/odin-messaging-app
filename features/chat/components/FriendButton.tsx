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
  recipientId: string;
  initialRequested?: boolean;
  initialRequestId?: string | null;
}) => {
  const [requested, setRequested] = useState(initialRequested);
  const [requestId, setRequestId] = useState<string | null>(initialRequestId);
  const [pending, startTransition] = useTransition();

  const send = () => {
    setRequested(true);
    startTransition(async () => {
      const result = await handleSendFriendRequest(recipientId);
      if (result.success) {
        setRequestId(result.requestId);
      } else {
        setRequested(false);
      }
    });
  };

  const cancel = () => {
    if (!requestId) {
      setRequested(false);
      return;
    }
    setRequested(false);
    setRequestId(null);
    startTransition(async () => {
      const result = await handleCancelFriendRequest(requestId);
      if (!result.success) {
        setRequested(true);
        setRequestId(requestId);
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
