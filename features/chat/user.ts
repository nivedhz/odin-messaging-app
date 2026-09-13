import prisma from "@/lib/db";

// Get user, include chats (members) and messages without password
export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      chats: {
        include: {
          members: {
            omit: {
              password: true,
            },
          },
          messages: {
            orderBy: { updatedAt: "asc" },
          },
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

// getSent friend requests aka the requests whose status is pending and the requesterId is the current userId (sent by user)
export async function getSentFriendRequests(userId: string) {
  const requests = await prisma.friendship.findMany({
    where: {
      requesterId: userId,
      status: "PENDING",
    },
  });
  return requests;
}

// getReceived friend requests aka the requests whose status is pending and the recipientId is the current user (sent to user)
export async function getReceivedFriendRequests(userId: string) {
  const requests = await prisma.friendship.findMany({
    where: {
      recipientId: userId,
      status: "PENDING",
    },
  });
  return requests;
}

// create a new friend request with the given recipient and requesterId should be defaulted to current user but it is not because of the infinte render loop and also no need to set the status to pending as it is already defaulted
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

// update the status of the friend request of the given id to accepted
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

// delete the friend request of the given requestId
export async function rejectFriendRequest(requestId: string) {
  const request = await prisma.friendship.delete({
    where: {
      id: requestId,
    },
  });
  return request;
}

// somehow it is same for some reason, I wonder where it is used.
export async function cancelFriendRequest(requestId: string) {
  const request = await prisma.friendship.delete({
    where: {
      id: requestId,
    },
  });
  return request;
}

// Select all users where id is not the current user and the receivedFriendRequests is not accepted and the sent is also not accepted (mainly used to get the people's list)
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

// get all the friendships where status is accepted and either the recipient or requester is the current user
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
