import { hashPassword } from "@/lib/auth/password";
import prisma from "@/lib/db";
import { SignUpData, User } from "./types";

export async function signUp(input: SignUpData): Promise<User> {
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

  return user;
}
