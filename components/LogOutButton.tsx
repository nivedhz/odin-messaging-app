"use client";
import { deleteSession } from "@/lib/auth/session";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { useState, type ReactElement } from "react";

const LogOutButton = (): ReactElement => {
  const [deleting, setDeleting] = useState(false);
  return (
    <Button
      className="text-sm font-medium tracking-[-0.01em] text-white/60 transition-colors hover:text-white"
      variant={"ghost"}
      onClick={() => {
        setDeleting(true);
        deleteSession();
        redirect("/login");
      }}
    >
      {deleting ? "Logging out..." : "Log out"}
    </Button>
  );
};

export default LogOutButton;
