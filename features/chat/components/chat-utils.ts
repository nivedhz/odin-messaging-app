/**
 * chat-utils.ts — tiny pure helpers shared by every chat component.
 * No React, no backend: deterministic functions of their inputs, which is
 * why they can be unit-tested in isolation and used on server or client.
 */

/** The four gradient pairs cycled through for letter avatars. */
const AVATAR_GRADIENTS = [
  "from-brand to-[#7C5CFC]",
  "from-[#FF9FFC] to-[#7C5CFC]",
  "from-emerald-300 to-teal-500",
  "from-amber-200 to-orange-400",
];

/**
 * Picks a deterministic gradient for any id/username: the same key always
 * yields the same avatar color, so a person is recognizable across the
 * sidebar, thread header, and message bubbles without storing a color.
 */
export function avatarGradient(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

/** Clock time in the viewer's locale ("2:30 PM") for message ticks. */
export function messageTime(value: Date): string {
  return value.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Sidebar-style stamp: time today, "Yesterday", weekday, else short date.
/** Human list stamp: clock time if today, then Yesterday / weekday / date. */
export function smartTime(value: Date): string {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (+startOfDay(new Date()) - +startOfDay(value)) / 86400000,
  );
  if (diffDays <= 0) return messageTime(value);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return value.toLocaleDateString(undefined, { weekday: "short" });
  }
  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** "Oct 2026"-style label for the "friends since" marker. */
export function monthYear(value: Date): string {
  return value.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

/** Calendar-day equality (ignores clock time) for day-divider grouping. */
export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Day-divider label: Today / Yesterday / full date ("Monday, Oct 6"). */
export function dayLabel(value: Date): string {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (+startOfDay(new Date()) - +startOfDay(value)) / 86400000,
  );
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return value.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * Last-activity timestamp for sidebar sorting: the newest message's time
 * when the thread has messages, otherwise the chat's own updatedAt.
 * Takes the LIVE message list (including just-sent ones) so a new message
 * bumps its chat to the top instantly. Returns an ISO string the caller
 * can `+new Date(...)` directly in a comparator.
 */
export function lastActivity(
  messages: { createdAt: string }[],
  updatedAt: string,
): string {
  return messages.length > 0
    ? messages[messages.length - 1].createdAt
    : updatedAt;
}
