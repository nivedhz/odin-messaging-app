import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import FloatingCard from "./FloatingCard";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="animate-fade-up pt-20 text-center sm:pt-28">
            <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 shadow-lg backdrop-blur-xl">
              <Sparkles width={14} className="text-brand" />
              Not Real-time • Not Encrypted • Not Blazing fast
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
              Elevate Your
            </h1>
            <h1 className="animate-gradient-pan text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl text-brand">
              Messaging Experience
            </h1>
          </div>
          <div className="animate-fade-up delay-200 flex flex-col items-center gap-6">
            <div className="max-w-md text-center">
              <p className="text-sm leading-relaxed text-white/60 sm:text-base">
                Unlock your messaging potential in a fully regulated
                environment, powered by Sendzy
              </p>
            </div>
            <Link href={"sign-up"}>
              <Button
                size="lg"
                className={
                  "cursor-pointer rounded-full bg-brand px-7 py-6 text-base font-medium text-[#1a1333] shadow-xl shadow-brand/25 transition-all hover:-translate-y-0.5 hover:bg-[#d6cbf3] hover:shadow-2xl hover:shadow-brand/35 active:translate-y-0"
                }
              >
                Sign Up & Start Messaging
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-16 flex w-full flex-col items-center justify-center gap-6 pb-16 sm:flex-row sm:items-start sm:justify-between sm:gap-4 lg:px-16">
          <div className="animate-fade-up delay-300 sm:-translate-y-10 sm:rotate-[-4deg]">
            <FloatingCard
              name="Humpty"
              message="I am sitting on a high place"
              time="2m ago"
              className="delay-1000"
            />
          </div>
          <div className="animate-fade-up delay-500 sm:translate-y-6 sm:rotate-3">
            <FloatingCard
              name="Cindrella"
              message="Ah shit! I just lost my shoe."
              time="now"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
