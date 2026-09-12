import Link from "next/link";
import { ArrowLeft, CheckCheck, MessagesSquare, Send } from "lucide-react";
import {
  avatarGradient,
  dayLabel,
  messageTime,
  sameDay,
} from "./chat-utils";

export interface ThreadMessage {
  id: string;
  content: string;
  createdAt: Date;
  creatorId: string;
}

interface ChatThreadProps {
  chat: { id: string; index: number; total: number; name: string } | null;
  messages: ThreadMessage[];
  currentUserId: string;
  hasChats: boolean;
}

const ChatThread = ({
  chat,
  messages,
  currentUserId,
  hasChats,
}: ChatThreadProps) => {
  if (!chat) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <span className="animate-fade-up grid size-14 place-items-center rounded-3xl border border-white/10 bg-white/5">
          <MessagesSquare width={24} className="text-brand" />
        </span>
        <div className="animate-fade-up delay-100">
          <p className="text-lg font-semibold tracking-[-0.02em] text-white">
            {hasChats ? "Select a conversation" : "Your inbox is quiet"}
          </p>
          <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-white/50">
            {hasChats
              ? "Pick a chat from the list to read through your messages."
              : "Your chats and messages will appear here once they exist."}
          </p>
        </div>
      </div>
    );
  }

  const title = chat.name;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-6">
        <Link
          href="/chat"
          aria-label="Back to conversations"
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/20 hover:text-white md:hidden"
        >
          <ArrowLeft width={16} />
        </Link>
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-[#1a1333] ${avatarGradient(chat.name || chat.id)}`}
        >
          {title.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
            {title}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-white/45">
            <span className="animate-pulse-dot size-1.5 rounded-full bg-emerald-400" />
            {chat.total === 1
              ? "1 message"
              : `${chat.total} messages`}
          </p>
        </div>
      </div>

      <div className="scroll-slim flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm font-semibold text-white">
              No messages yet
            </p>
            <p className="max-w-[240px] text-xs leading-relaxed text-white/45">
              This conversation exists, but nothing has been said here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {messages.map((message, i) => {
              const prev = messages[i - 1];
              const isMine = message.creatorId === currentUserId;
              const startsGroup =
                !prev ||
                prev.creatorId !== message.creatorId ||
                message.createdAt.getTime() - prev.createdAt.getTime() >
                  5 * 60 * 1000;
              const showDay =
                i === 0 || !sameDay(prev.createdAt, message.createdAt);
              return (
                <div key={message.id} className="contents">
                  {showDay && (
                    <div className="flex justify-center py-4 first:pt-1">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-[11px] font-medium tracking-wide text-white/50">
                        {dayLabel(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div
                    className={
                      isMine
                        ? "flex justify-end"
                        : "flex items-end justify-start gap-2"
                    }
                  >
                    {!isMine && (
                      <span
                        aria-hidden="true"
                        className={
                          startsGroup
                            ? `size-7 shrink-0 rounded-full bg-gradient-to-br ${avatarGradient(message.creatorId)}`
                            : "w-7 shrink-0"
                        }
                      />
                    )}
                    <div
                      className={
                        isMine
                          ? "flex max-w-[80%] flex-col items-end"
                          : "flex max-w-[80%] flex-col items-start"
                      }
                    >
                      {isMine && startsGroup && (
                        <span className="mb-1 text-[11px] font-medium text-white/40">
                          You
                        </span>
                      )}
                      <p
                        title={messageTime(message.createdAt)}
                        className={
                          isMine
                            ? "w-fit rounded-2xl rounded-tr-md bg-brand px-4 py-2.5 text-sm leading-relaxed font-medium text-[#1a1333] shadow-lg shadow-brand/20"
                            : "w-fit rounded-2xl rounded-tl-md bg-white/10 px-4 py-2.5 text-sm leading-relaxed text-white/90"
                        }
                      >
                        {message.content}
                      </p>
                      {isMine && (
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-white/35">
                          {messageTime(message.createdAt)}
                          <CheckCheck width={12} className="text-brand" />
                        </span>
                      )}
                      {!isMine &&
                        (i === messages.length - 1 ||
                          messages[i + 1].creatorId !== message.creatorId) && (
                          <span className="mt-1 text-[10px] text-white/35">
                            {messageTime(message.createdAt)}
                          </span>
                        )}
                    </div>
                  </div>
                  {startsGroup && <div className="h-2" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 px-4 py-3.5 sm:px-6">
        <div
          aria-disabled="true"
          className="flex items-center gap-2 opacity-60"
        >
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/35">
            Messaging is read-only in this preview…
          </div>
          <span className="grid size-12 shrink-0 cursor-not-allowed place-items-center rounded-2xl bg-brand/40">
            <Send width={17} className="text-[#1a1333]/60" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatThread;
