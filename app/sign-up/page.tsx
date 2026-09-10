import SignUpForm from "@/features/auth/sign-up/components/SignUpForm";
import SignUpSidePanel from "@/features/auth/sign-up/components/SignUpSidePanel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const SignUp = () => {
  return (
    <div className="w-full text-white max-h-screen overflow-hidden">
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
            Sendzy
          </span>
        </div>

        {/* Split */}
        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <SignUpSidePanel />
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
