import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";

export async function findUserById(id: number) {
  try {
    const userId = await prisma.user.findUnique({ where: { id } });
    if (!userId) throw new Error(`User at id:${id} not exist`);
    return userId;
  } catch (error: any) {
    return error.message;
  }
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    throw new Error(`user with this email: ${email} does not exist`);
  }
  return user;
}

export async function getLoggedInUser(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new Error("user not found");
  }
  return user;
}
