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

export async function getSentFriendRequests(userId: string) {
  const requests = await prisma.friendship.findMany({
    where: {
      requesterId: userId,
      status: "PENDING",
    },
  });
  return requests;
}

export async function getReceivedFriendRequests(userId: string) {
  const requests = await prisma.friendship.findMany({
    where: {
      recipientId: userId,
      status: "PENDING",
    },
  });
  return requests;
}

export async function sendFriendRequest(
  requesterId: string,
  recipientId: string,
) {
  const request = await prisma.friendship.create({
    data: {
      requesterId,
      recipientId,
      status: "PENDING",
    },
  });
  return request;
}

export async function acceptFriendRequest(requestId: string) {
  const request = await prisma.friendship.update({
    where: {
      id: requestId,
    },
    data: {
      status: "ACCEPTED",
    },
  });
  return request;
}

export async function rejectFriendRequest(requestId: string) {
  const request = await prisma.friendship.delete({
    where: {
      id: requestId,
    },
  });
  return request;
}

export async function cancelFriendRequest(requestId: string) {
  const request = await prisma.friendship.delete({
    where: {
      id: requestId,
    },
  });
  return request;
}

export async function getAllUsers(userId: string) {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
      AND: [
        {
          receivedFriendRequests: {
            none: {
              status: "ACCEPTED",
              requesterId: userId,
            },
          },
        },
        {
          sentFriendRequests: {
            none: {
              status: "ACCEPTED",
              recipientId: userId,
            },
          },
        },
      ],
    },
  });

  return users;
}

export async function getFriends(userId: string) {
  const friends = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          recipientId: userId,
        },
        {
          requesterId: userId,
        },
      ],
    },
    select: {
      recipient: {
        omit: {
          password: true,
        },
      },
      requester: {
        omit: {
          password: true,
        },
      },
    },
  });
  return friends;
}
