"use client";

import { Check, MessageCircle, Users, X } from "lucide-react";
import { avatarGradient, monthYear } from "./chat-utils";
import type { PeerData } from "./chat-types";

/**
 * FriendsPanel — the Friends tab: incoming requests on top, friend list
 * below. Tapping a friend row stages that person as a pending thread
 * (`onChatWith`); like Suggested, nothing is created until first send.
 *
 * Accept / decline affordances are deliberately inert visuals for now.
 * `onFindPeople` jumps the parent back to the People tab.
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
  return (
    <div className="flex flex-col gap-5 px-1 pb-4">
      <div>
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Requests · {receivedRequests.length}
        </p>
        {receivedRequests.length === 0 ? (
          <p className="px-2 pt-2 text-xs leading-relaxed text-white/45">
            No pending requests. When someone adds you, you can accept or
            decline here.
          </p>
        ) : (
          <div className="mt-2 space-y-1">
            {receivedRequests.map((request) => (
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
                {/* Inert accept / decline affordances (no handlers yet). */}
                <span className="flex shrink-0 items-center gap-1.5">
                  <span
                    title={`Accept ${request.username} (visual only)`}
                    className="grid size-8 place-items-center rounded-full bg-brand text-[#1a1333]"
                  >
                    <Check width={15} />
                  </span>
                  <span
                    title={`Decline ${request.username} (visual only)`}
                    className="grid size-8 place-items-center rounded-full border border-white/15 bg-white/5 text-white/60"
                  >
                    <X width={15} />
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
          Friends · {friends.length}
        </p>
        {friends.length === 0 ? (
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
            {friends.map((friend) => (
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
