import { hashPassword } from "@/lib/auth/password";
import prisma from "@/lib/db";
import { SignUpData, SignUpResponse } from "./types";
import { createSession } from "@/lib/session";

const userExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return !!user;
};

export async function signUp(input: SignUpData): Promise<SignUpResponse> {
  const userStatus = await userExists(input.email);
  if (userStatus)
    return {
      success: false,
      message: "User with the email already exists",
    };

  const hashedPassword = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  await createSession(user.id);

  return {
    success: true,
    message: "",
  };
}
