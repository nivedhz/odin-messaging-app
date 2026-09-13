/**
 * chat-types.ts — shared data shapes for the chat UI.
 *
 * Everything here is plain, JSON-serializable data (dates travel as ISO
 * strings) so the server page can build these objects from `getUser()` and
 * hand them to the client `ChatScreen` with zero refetching.
 */

/** One chat message as the UI needs it. */
export interface ChatMessageData {
  /** Message row id (used as React key). */
  id: string;
  /** Raw text content. */
  content: string;
  /** ISO timestamp — parsed with `new Date()` wherever it is displayed. */
  createdAt: string;
  /** Id of the user who wrote it (compared against `currentUserId`). */
  creatorId: string;
}

/** One conversation in the sidebar + thread. */
export interface ChatData {
  /** Chat row id. Pending (not-yet-created) threads use `pending:<userId>`. */
  id: string;
  /** Position in the sidebar sort order. */
  index: number;
  /** Display name, derived from the other members (or "Just you"). */
  name: string;
  /** ISO timestamp, used for sidebar sorting. */
  updatedAt: string;
  /** All members — drives sender names and the "chat with" lookup. */
  members: { id: string; username: string }[];
  /** Full message history, oldest first. */
  messages: ChatMessageData[];
}

/** A discoverable user in the People tab. */
export interface PeopleData {
  id: string;
  username: string;
  email: string;
}

/**
 * A friend / requester / suggested person.
 * `since` is the friendship acceptance date as an ISO string, when known.
 */
export interface PeerData {
  /** Friendship/request row id (doubles as React key). */
  id: string;
  /** The other user's id — the stable identity for lookups and actions. */
  userId: string;
  username: string;
  email: string;
  since?: string;
}

/** Sidebar tab identifiers. */
export type SidebarTab = "chats" | "people" | "friends";

/** A pending (not-yet-created) thread. Real chats are created on first send. */
export interface PendingPeer {
  userId: string;
  username: string;
}
