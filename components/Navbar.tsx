import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <header className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8">
      <div className="flex items-center justify-between pb-5">
        <Link href={"/"} className="flex items-center gap-3">
          <span className="text-2xl font-semibold tracking-[-0.02em] text-white">
            Sendzy
          </span>
        </Link>
        <div className="flex items-center gap-7">
          <Link
            href={"login"}
            className="text-sm font-medium tracking-[-0.01em] text-white/60 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link href={"sign-up"}>
            <Button
              className={
                "h-9 cursor-pointer rounded-full bg-brand px-5 text-sm font-semibold tracking-[-0.01em] text-[#1A1333] hover:bg-brand/85"
              }
            >
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
