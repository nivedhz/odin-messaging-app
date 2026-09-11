"use client";
import { deleteSession } from "@/lib/session";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

const LogOutButton = () => {
  return (
    <Button
      className="text-sm font-medium tracking-[-0.01em] text-white/60 transition-colors hover:text-white"
      variant={"ghost"}
      onClick={() => {
        deleteSession();
        redirect("/login");
      }}
    >
      Log out
    </Button>
  );
};

export default LogOutButton;
