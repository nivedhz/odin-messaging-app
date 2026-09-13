"use client";

import { ImagePlus, Send } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

/**
 * MessageComposer — the message input bar: attachment stub, text field
 * with emoji picker, and the send button.
 *
 * The draft text lives in the parent (it owns sending + emoji insertion),
 * so this component is a controlled input with zero local state. Submit is
 * a real `<form>` submit (Enter key works natively); the send button stays
 * disabled on empty/whitespace drafts and while a send is in flight.
 * The image tile is a deliberate stub — image storage doesn't exist yet.
 */
interface MessageComposerProps {
  /** Name of the open chat/peer — feeds placeholder + aria label. */
  chatName: string;
  /** Controlled draft text, owned by the parent. */
  draft: string;
  /** Parent setter for keystrokes. */
  onDraftChange: (value: string) => void;
  /** Ref so the parent's emoji insertion can restore the caret. */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Parent emoji handler (splices at the caret, keeps focus). */
  onPickEmoji: (emoji: string) => void;
  /** True while a send action is in flight (locks the form). */
  sending: boolean;
  /** Parent send flow (first-send creation or plain append). */
  onSend: () => void;
}

const MessageComposer = ({
  chatName,
  draft,
  onDraftChange,
  inputRef,
  onPickEmoji,
  sending,
  onSend,
}: MessageComposerProps) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
      className="border-t border-white/10 px-4 py-3.5 sm:px-6"
    >
      <div className="flex items-end gap-2">
        <div className="flex flex-1 items-end gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 transition-colors focus-within:border-brand/50">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder={`Message ${chatName}…`}
            aria-label={`Message ${chatName}`}
            className="max-h-32 min-h-8 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/30"
          />
          <EmojiPicker onPick={onPickEmoji} />
        </div>
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          aria-label="Send message"
          className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-2xl bg-brand text-[#1a1333] shadow-lg shadow-brand/25 transition-all hover:bg-[#d6cbf3] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send width={17} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
};

export default MessageComposer;
