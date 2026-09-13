"use client";

import { useState } from "react";
import { MessageCircle, Users } from "lucide-react";
import { avatarGradient, monthYear } from "./chat-utils";
import FriendRequestActions from "./FriendRequestActions";
import type { PeerData } from "./chat-types";

/**
 * FriendsPanel — the Friends tab: incoming requests on top, friend list
 * below. Tapping a friend row stages that person as a pending thread
 * (`onChatWith`); like Suggested, nothing is created until first send.
 *
 * Accept / decline are fully working: confirming moves the row into the
 * friends list (or drops it) instantly via local `decided` state — no
 * refetch needed. `onFindPeople` jumps the parent back to the People tab.
 */
interface FriendsPanelProps {
  /** Pending inbound requests (each carries the sender's profile). */
  receivedRequests: PeerData[];
  /** Accepted friends. */
  friends: PeerData[];
  /** userId of the staged pending person (drives row highlight). */
  activeUserId: string | null;
  /** Parent handler — receives the tapped friend for pending staging. */
  onChatWith: (friend: PeerData) => void;
  /** Parent handler — switches the sidebar back to the People tab. */
  onFindPeople: () => void;
}

const FriendsPanel = ({
  receivedRequests,
  friends,
  activeUserId,
  onChatWith,
  onFindPeople,
}: FriendsPanelProps) => {
  // Locally decided request ids: "accepted" rows graduate into the friends
  // list below, "declined" rows vanish. Keyed by request id so the server
  // props stay the source of truth on next full load.
  const [decided, setDecided] = useState<Record<string, "accepted" | "declined">>({});

  // Still-pending rows: anything the user hasn't ruled on this session.
  const openRequests = receivedRequests.filter(
    (request) => !decided[request.id],
  );
  // Accepted senders appear as friends immediately (same PeerData shape).
  const justAccepted: PeerData[] = receivedRequests
    .filter((request) => decided[request.id] === "accepted")
    .map((request) => ({
      id: request.id,
      userId: request.userId,
      username: request.username,
      email: request.email,
    }));
  const allFriends = [...justAccepted, ...friends];

  return (
    <div className="flex flex-col gap-5 px-1 pb-4">
      <div>
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Requests · {openRequests.length}
        </p>
        {openRequests.length === 0 ? (
          <p className="px-2 pt-2 text-xs leading-relaxed text-white/45">
            No pending requests. When someone adds you, you can accept or
            decline here.
          </p>
        ) : (
          <div className="mt-2 space-y-1">
            {openRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br text-xs font-bold text-[#1a1333] ${avatarGradient(request.username)}`}
                >
                  {request.username.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-white">
                    {request.username}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">
                    Wants to be friends
                  </span>
                </span>
                {/* Working accept / decline — parent updates on confirm. */}
                <FriendRequestActions
                  requestId={request.id}
                  username={request.username}
                  onDecided={(outcome) =>
                    setDecided((prev) => ({ ...prev, [request.id]: outcome }))
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Friends · {allFriends.length}
        </p>
        {allFriends.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Users width={20} className="text-white/40" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">No friends yet</p>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                People you add will appear here. Head to People to send your
                first request.
              </p>
            </div>
            <button
              type="button"
              onClick={onFindPeople}
              className="mt-1 cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              Find people
            </button>
          </div>
        ) : (
          <div className="mt-2 space-y-1">
            {allFriends.map((friend) => (
              <button
                key={friend.id}
                type="button"
                onClick={() => onChatWith(friend)}
                title={`Chat with ${friend.username}`}
                className={
                  activeUserId === friend.userId
                    ? "flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-brand/50 bg-brand/10 px-3 py-2.5 text-left"
                    : "flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                }
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-[#1a1333] ${avatarGradient(friend.username)}`}
                >
                  {friend.username.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-white">
                    {friend.username}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">
                    {friend.email}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-white/40">
                  {friend.since && (
                    <span className="hidden text-[11px] xl:block">
                      {monthYear(new Date(friend.since))}
                    </span>
                  )}
                  <span className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/5 transition-colors group-hover:border-white/25">
                    <MessageCircle width={15} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPanel;
