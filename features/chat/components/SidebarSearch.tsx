"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

/**
 * SidebarSearch — controlled search box with a Ctrl+K shortcut hint.
 *
 * Filtering itself is instant client-side state in the parent; this component
 * only owns the input element and the global shortcut. The `Ctrl K` chip is
 * decorative on touch devices (hidden below `md`).
 */
interface SidebarSearchProps {
  /** Current filter text, owned by the parent. */
  value: string;
  /** Called on every keystroke — parent filters its already-loaded arrays. */
  onChange: (value: string) => void;
  /** Placeholder adapts to the active tab. */
  placeholder: string;
}

const SidebarSearch = ({ value, onChange, placeholder }: SidebarSearchProps) => {
  // Autofocus handle for the shortcut (owned here because the input lives here).
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K focuses search from anywhere on the page.
  // Listener is mounted once; `preventDefault` stops the browser's own
  // Ctrl+K behavior (address-bar focus) from firing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="px-4 pt-3">
      <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 transition-colors focus-within:border-brand/50 hover:border-white/20">
        <Search width={15} className="shrink-0 text-white/40" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
        <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/40 md:block">
          Ctrl K
        </kbd>
      </label>
    </div>
  );
};

export default SidebarSearch;
