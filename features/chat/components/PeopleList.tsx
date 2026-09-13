"use client";

import { MessageCircle } from "lucide-react";
import { avatarGradient } from "./chat-utils";
import FriendButton from "./FriendButton";
import type { PeopleData } from "./chat-types";

/**
 * PeopleList — every discoverable user with an Add / Requested pill.
 *
 * The pill is a live toggle (see FriendButton); this list only resolves
 * each row's initial state from the sent-requests read. Search filtering
 * happens in the parent against this same already-loaded array.
 */
interface PeopleListProps {
  /** Filtered people to render (empty → the empty-state block below). */
  people: PeopleData[];
  /** Outgoing pending requests — seeds each pill's state + cancel target. */
  sentRequests: { recipientId: string; requestId: string }[];
  /** Raw search text, echoed back only inside the "no matches" copy. */
  query: string;
}

const PeopleList = ({ people, sentRequests, query }: PeopleListProps) => {
  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <MessageCircle width={20} className="text-white/40" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">
            {query ? "No people found" : "Nobody else is here yet"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/45">
            {query
              ? `No one matches “${query}”.`
              : "New Sendzy members will show up here."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {people.map((person) => (
        <div
          key={person.id}
          className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors hover:bg-white/5"
        >
          {/* Letter avatar: first username character on a hashed gradient. */}
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-[#1a1333] ${avatarGradient(person.username)}`}
          >
            {person.username.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold tracking-[-0.01em] text-white">
              {person.username}
            </span>
            <span className="mt-0.5 block truncate text-xs text-white/45">
              {person.email}
            </span>
          </span>
          <FriendButton
            username={person.username}
            recipientId={person.id}
            initialRequested={sentRequests.some(
              (request) => request.recipientId === person.id,
            )}
            initialRequestId={
              sentRequests.find(
                (request) => request.recipientId === person.id,
              )?.requestId ?? null
            }
          />
        </div>
      ))}
    </>
  );
};

export default PeopleList;
