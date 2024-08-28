import prisma from "../../utils/db.util";

interface ICreateUser {
  username: string;
  email: string;
  password: string;
}

export async function signUp(data: ICreateUser) {
  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    });
    return user;
  } catch (error: any) {
    throw new error("user creation failed...");
  }
}
