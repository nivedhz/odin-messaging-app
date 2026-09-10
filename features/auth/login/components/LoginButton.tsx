"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-11 w-full cursor-pointer rounded-xl bg-brand font-semibold text-[#1a1333] shadow-lg shadow-brand/25 transition-all hover:-translate-y-px hover:bg-[#d6cbf3] hover:shadow-xl hover:shadow-brand/35 active:translate-y-0"
    >
      {pending ? "Logging you in..." : "Log In & Keep Chatting"}
    </Button>
  );
};

export default LoginButton;
