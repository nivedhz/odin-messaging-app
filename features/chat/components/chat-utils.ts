const AVATAR_GRADIENTS = [
  "from-brand to-[#7C5CFC]",
  "from-[#FF9FFC] to-[#7C5CFC]",
  "from-emerald-300 to-teal-500",
  "from-amber-200 to-orange-400",
];

export function avatarGradient(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

export function timeAgo(value: Date): string {
  const seconds = Math.floor((Date.now() - value.getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function messageTime(value: Date): string {
  return value.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function monthYear(value: Date): string {
  return value.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

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
