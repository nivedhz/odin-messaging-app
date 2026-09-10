import { hashPassword } from "@/lib/auth/password";
import prisma from "@/lib/db";
import { SignUpData, SignUpResponse } from "./types";

const userExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return !!user;
};

export async function signUp(input: SignUpData): Promise<SignUpResponse> {
  if (await userExists(input.email))
    return {
      success: false,
      message: "User with the email already exists",
    };

  const hashedPassword = await hashPassword(input.password);
  await prisma.user.create({
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

  return {
    success: true,
    message: "",
  };
}
