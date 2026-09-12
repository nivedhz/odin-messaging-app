import prisma from "@/lib/db";

export async function getUsername(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });

  return user?.username ?? null;
}
