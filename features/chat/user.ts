import prisma from "@/lib/db";

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      chats: true,
      messages: true,
    },
    omit: {
      password: true,
    },
  });

  return user;
}
