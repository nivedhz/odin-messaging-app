import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { LoginData } from "./types";

const userNotExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return !user;
};

const matchPassword = async (password: string, userPassword: string = "") => {
  return await bcrypt.compare(password, userPassword);
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
  const passwordMatch = await matchPassword(formData.password, user?.password);
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
