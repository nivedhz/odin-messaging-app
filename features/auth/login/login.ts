import prisma from "@/lib/db";
import { LoginData } from "./types";
import { comparePassword } from "@/lib/auth/password";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

export const login = async (formData: LoginData) => {
  const user = await getUser(formData.email);
  if (!user) {
    return {
      success: false,
      message: "User with this email doesn't exist",
    };
  }

  const passwordMatch = await comparePassword(
    formData.password,
    user?.password,
  );
  if (!passwordMatch) {
    return {
      success: false,
      message: "Incorrect username of password",
    };
  }

  await createSession(user?.id || "");
  redirect("/dashboard");
};
