import prisma from "@/lib/db";

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      chats: {
        include: {
          members: true,
          messages: true,
        },
      },
      messages: true,
    },
    omit: {
      password: true,
    },
  });

  return user;
}

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}
