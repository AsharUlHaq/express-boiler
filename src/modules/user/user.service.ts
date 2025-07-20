import prisma from "../../utils/db.util";
import { Prisma } from "@prisma/client";

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error(`User with id:${id} does not exist`);
    return user;
  } catch (error: any) {
    return error.message;
  }
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`User with email: ${email} does not exist`);
  }
  return user;
}

export async function getLoggedInUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
