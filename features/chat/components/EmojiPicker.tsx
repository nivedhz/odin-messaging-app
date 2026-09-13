"use client";

import { useEffect, useRef, useState } from "react";
import { Smile } from "lucide-react";

const CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: [
      "😀",
      "😁",
      "😂",
      "🤣",
      "😊",
      "😍",
      "😎",
      "🤔",
      "😐",
      "🙄",
      "😴",
      "🤯",
    ],
  },
  {
    label: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👏",
      "🙏",
      "💪",
      "👋",
      "✌️",
      "🤝",
      "👀",
      "🫡",
      "💅",
      "🤙",
    ],
  },
  {
    label: "Hearts",
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "💔",
      "💯",
      "💥",
      "✨",
    ],
  },
  {
    label: "Nature",
    emojis: [
      "🌙",
      "⭐",
      "🔥",
      "🌊",
      "🌸",
      "🍀",
      "🌈",
      "❄️",
      "🐶",
      "🐱",
      "🦄",
      "🐸",
    ],
  },
  {
    label: "Food",
    emojis: [
      "🍕",
      "🍔",
      "🍩",
      "🍎",
      "☕",
      "🍺",
      "🎂",
      "🍿",
      "🌮",
      "🍜",
      "🧋",
      "🍉",
    ],
  },
  {
    label: "Symbols",
    emojis: [
      "✅",
      "❌",
      "⚠️",
      "🎉",
      "🎁",
      "🏆",
      "📌",
      "🔔",
      "💡",
      "🎵",
      "🚀",
      "👑",
    ],
  },
];

/**
 * EmojiPicker — smile trigger + floating emoji panel inside the composer.
 *
 * No emoji library is installed: the grid is a hand-curated constant below,
 * which keeps the bundle at zero extra cost. The panel is absolutely
 * positioned (NOT portalled) because the chat pane's backdrop-blur traps
 * fixed-position popovers and clips them — inline avoids that entirely.
 * Insertion at the caret is the parent's job via `onPick`; this only
 * reports which emoji was tapped, then closes. Escape / outside-click /
 * toggle all close the panel; listeners are attached only while open.
 */
const EmojiPicker = ({ onPick }: { onPick: (emoji: string) => void }) => {
  const [category, setCategory] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open ]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Pick an emoji"
        aria-expanded={open}
        className={
          open
            ? "grid size-8 cursor-pointer place-items-center rounded-xl bg-white/10 text-white outline-none"
            : "grid size-8 cursor-pointer place-items-center rounded-xl text-white/40 transition-colors outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-brand/50"
        }
      >
        <Smile width={18} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full z-50 mb-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#17122b] p-3 shadow-2xl shadow-black/50 outline-none">
          <div className="scroll-slim flex gap-1 overflow-x-auto pb-2">
            {CATEGORIES.map((group, i) => (
              <button
                key={group.label}
                type="button"
                onClick={() => setCategory(i)}
                className={
                  category === i
                    ? "shrink-0 cursor-pointer rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white"
                    : "shrink-0 cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-medium text-white/50 transition-colors hover:text-white"
                }
              >
                {group.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-0.5">
            {CATEGORIES[category].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onPick(emoji);
                  setOpen(false);
                }}
                aria-label={`Insert ${emoji}`}
                className="grid size-10 cursor-pointer place-items-center rounded-xl text-xl transition-colors outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
