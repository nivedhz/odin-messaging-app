import SignUpForm from "@/features/auth/sign-up/components/SignUpForm";
import {
  ArrowLeft,
  CheckCheck,
  MessageCircle,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

const members = [
  {
    name: "SpongeBob",
    picture: "S",
  },
  {
    name: "Patrick",
    picture: "P",
  },
  {
    name: "Squidward",
    picture: "Q",
  },
  {
    name: "Mr. Krabs",
    picture: "K",
  },
];

const SignUp = () => {
  return (
    <div className="w-full text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href={"/"}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/70 backdrop-blur-xl transition-all hover:border-white/20 hover:text-white"
          >
            <ArrowLeft
              width={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Go back
          </Link>
          <span className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <Send width={20} className="text-brand" strokeWidth={2.5} />
            Sendzy
          </span>
        </div>

        {/* Split */}
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left — messaging vibe */}
          <div className="hidden flex-col gap-7 md:flex">
            <div className="animate-fade-up flex flex-col gap-4">
              <p className="w-fit rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-medium tracking-wide text-white/75 backdrop-blur-xl">
                ● Not a lot of people are online now
              </p>
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                Jump straight into
                <span className="animate-gradient-pan block bg-linear-to-r from-brand via-[#FF9FFC] to-brand bg-clip-text text-transparent">
                  the conversation.
                </span>
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                Create an account, grab a username, and start messaging in
                seconds. Slow, un-encrypted, and built for groups that never
                sleep.
              </p>
            </div>

            {/* Live chat mock */}
            <div className="animate-fade-up delay-200 overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/40 backdrop-blur-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="flex -space-x-2">
                  {members.map((member) => (
                    <span
                      key={member.name}
                      className="grid size-8 place-items-center rounded-full border-2 border-[#1a1033] bg-linear-to-br from-brand to-[#FF9FFC] text-xs font-bold text-[#1a1333]"
                    >
                      {member.picture}
                    </span>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">#bikini-bottom</p>
                  <p className="flex items-center gap-1.5 text-xs text-white/50">
                    <span className="animate-pulse-dot size-1.5 rounded-full bg-emerald-400" />
                    {members.length} online • typing…
                  </p>
                </div>
                <MessageCircle width={18} className="text-white/40" />
              </div>

              <div className="flex flex-col gap-3 px-5 py-5">
                <div className="animate-message-left flex flex-col gap-1">
                  <span className="text-xs text-white/40">SpongeBob</span>
                  <p className="w-fit max-w-[80%] rounded-2xl rounded-tl-md bg-white/10 px-4 py-2.5 text-sm text-white/90">
                    The Krusty Krab pizza is the pizza for you and me!
                  </p>
                </div>
                <div className="animate-message-right delay-100 flex flex-col items-end gap-1">
                  <p className="w-fit max-w-[80%] rounded-2xl rounded-tr-md bg-brand px-4 py-2.5 text-sm font-medium text-[#1a1333] shadow-lg shadow-brand/25">
                    Is mayonnaise an instrument?
                  </p>
                  <span className="flex items-center gap-1 text-[11px] text-white/40">
                    Seen <CheckCheck width={13} className="text-brand" />
                  </span>
                </div>
                <div className="animate-message-left delay-300 flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white/10 px-4 py-3 w-fit">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="animate-typing-dot size-1.5 rounded-full bg-white/70"
                      style={{ animationDelay: `${i * 180}ms` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 px-5 py-4">
                <div className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/35">
                  Message #bikini-bottom
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand shadow-lg shadow-brand/30">
                  <Send
                    width={15}
                    className="text-[#1a1333]"
                    strokeWidth={2.5}
                  />
                </span>
              </div>
            </div>

            {/* Trust row */}
            <div className="animate-fade-up delay-300 flex flex-wrap gap-5 text-xs text-white/55">
              <span className="flex items-center gap-1.5">
                <ShieldCheck width={15} className="text-brand" /> Un-Encrypted
                by default
              </span>
              <span className="flex items-center gap-1.5">
                <Zap width={15} className="text-brand" /> &gt;50ms delivery
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCheck width={15} className="text-brand" /> Read receipts &
                reactions
              </span>
            </div>
          </div>

          {/* Right — form */}
          <div className="animate-fade-up delay-100 mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            {/* Mobile headline */}
            <div className="mb-6 text-center md:hidden">
              <h1 className="text-3xl font-semibold tracking-tight">
                Join{" "}
                <span className="bg-linear-to-r from-brand to-[#FF9FFC] bg-clip-text text-transparent">
                  Sendzy
                </span>
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Start messaging in seconds.
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
