import prisma from "@/lib/db";
import { LoginData } from "./types";
import { comparePassword } from "@/lib/auth/password";

const userNotExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return !user;
};

export const login = async (formData: LoginData) => {
  if (await userNotExists(formData.email)) {
    return {
      success: false,
      message: "User with this email doesn't exist",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: formData.email },
  });
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

  return {
    success: true,
    message: "Welcome back! Redirecting you to your chats…",
  };
};
