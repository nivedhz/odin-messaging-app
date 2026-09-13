"use client";

import type { SidebarTab } from "./chat-types";

/**
 * SidebarTabs — the Chats / People / Friends segmented control.
 *
 * Purely presentational: tapping a tab only flips parent state, so switching
 * never reloads the page and the open thread stays put.
 */
const TABS: { id: SidebarTab; label: string }[] = [
  { id: "chats", label: "Chats" },
  { id: "people", label: "People" },
  { id: "friends", label: "Friends" },
];

interface SidebarTabsProps {
  /** Currently selected tab (drives the highlighted pill). */
  tab: SidebarTab;
  /** Parent state setter — no navigation, no fetching. */
  onChange: (tab: SidebarTab) => void;
}

const SidebarTabs = ({ tab, onChange }: SidebarTabsProps) => {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 mx-4 mt-4">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={
            tab === t.id
              ? "flex-1 cursor-pointer rounded-xl bg-white/10 px-3 py-1.5 text-center text-[13px] font-semibold text-white"
              : "flex-1 cursor-pointer rounded-xl px-3 py-1.5 text-center text-[13px] font-medium text-white/50 transition-colors hover:text-white"
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default SidebarTabs;
