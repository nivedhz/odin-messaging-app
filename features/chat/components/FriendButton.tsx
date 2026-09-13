/**
 * FriendButton — the Add / Requested pill on each row of the People list.
 *
 * Deliberately inert: this is pure UI with no click behavior and no server
 * call. `initialRequested` (seeded from the sent-requests read) picks which
 * of the two visual states renders. Wiring the real send/cancel happens
 * elsewhere; this file must stay free of actions.
 */
import { Check, UserPlus } from "lucide-react";

const FriendButton = ({
  username,
  initialRequested = false,
}: {
  username: string;
  initialRequested?: boolean;
}) => {
  if (initialRequested) {
    return (
      <button
        type="button"
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
      title={`Send friend request to ${username} (visual only)`}
      className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-brand px-3.5 text-xs font-semibold text-[#1a1333] transition-colors hover:bg-brand/85"
    >
      <UserPlus width={14} />
      Add
    </button>
  );
};

export default FriendButton;
