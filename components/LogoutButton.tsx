/**
 * LogoutButton — navbar "Log out" trigger + centered confirmation modal.
 *
 * Split responsibilities, exactly as specified:
 * - The navbar trigger ONLY opens the modal (no session touching).
 * - The modal's Log out button is the ONLY place that calls
 *   `deleteSession()`, then routes to /login.
 *
 * The modal is a fullscreen fixed overlay (dim #111 veil, card dead
 * center) — never anchored to the navbar. Escape, backdrop click, and
 * Cancel all dismiss without touching the session.
 */
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { deleteSession } from "@/lib/auth/session";

const LogoutButton = () => {
  // Modal visibility — the only state the navbar trigger touches.
  const [confirming, setConfirming] = useState(false);
  // In-flight session delete — locks the confirm button.
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  // Escape dismisses, and the page behind never scrolls while open.
  useEffect(() => {
    if (!confirming) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirming(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [confirming]);

  // THE session call site: delete cookie, then go to login fresh.
  const confirmLogout = () => {
    startTransition(async () => {
      await deleteSession();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <>
      {/* Navbar trigger — same type treatment as the Online/username text. */}
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="cursor-pointer text-xs font-medium tracking-[-0.01em] text-white/50 transition-colors hover:text-white"
      >
        Log out
      </button>

      {confirming && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm log out"
          onClick={() => {
            if (!pending) setConfirming(false);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111]/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="animate-fade-up w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/50 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center gap-3 px-6 pt-7 text-center">
              <span className="grid size-12 place-items-center rounded-2xl border border-red-400/20 bg-red-500/10">
                <LogOut width={20} className="text-red-300" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-[-0.02em] text-white">
                  Log out of Sendzy?
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/55">
                  You will need to log back in to read your messages.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 px-6 py-6">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={pending}
                className="h-11 flex-1 cursor-pointer rounded-xl border border-white/15 bg-white/5 text-sm font-medium text-white/80 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={pending}
                className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-semibold text-white shadow-lg shadow-red-950/40 transition-colors hover:bg-red-400 disabled:cursor-wait disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 width={16} className="animate-spin" />
                ) : (
                  <LogOut width={16} />
                )}
                {pending ? "Logging out…" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
