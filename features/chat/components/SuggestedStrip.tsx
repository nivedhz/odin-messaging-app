"use client";

import RecommendButton from "./RecommendButton";
import type { PeerData } from "./chat-types";

/**
 * SuggestedStrip — horizontal "people you may want to message" rail above
 * the chat list. Only friends WITHOUT an existing chat appear here (the
 * parent filters them out once a DM exists).
 *
 * Tapping a chip stages a pending thread only — nothing is created in the
 * db until the first message is sent. `activeUserId` drives the brand-ring
 * selection indicator on the tapped chip.
 */
interface SuggestedStripProps {
  /** Friends with no DM yet. Empty (or an active search) hides the rail. */
  people: PeerData[];
  /** userId of the tapped chip, or null when nothing is staged. */
  activeUserId: string | null;
  /** Parent handler: stages/clears the pending thread. */
  onRecommend: (person: PeerData) => void;
}

const SuggestedStrip = ({
  people,
  activeUserId,
  onRecommend,
}: SuggestedStripProps) => {
  if (people.length === 0) return null;

  return (
    <div className="px-1 pt-1 pb-3">
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
        Suggested
      </p>
      <div className="scroll-slim flex gap-3 overflow-x-auto px-1 pb-1">
        {people.map((person) => (
          <RecommendButton
            person={person}
            key={person.id}
            onRecommend={() => onRecommend(person)}
            active={activeUserId === person.userId}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedStrip;
