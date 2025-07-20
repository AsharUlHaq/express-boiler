import prisma from "../../utils/db.util";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change";

interface ICreateUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country: string;
}

interface ILoginInput {
  email: string;
  password: string;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function signUp(data: ICreateUser) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { name: data.name }],
    },
  });

  if (existingUser) {
    throw new Error("Name or email already exists.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      city: data.city,
      country: data.country,
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    city: newUser.city,
    country: newUser.country,
  };
}

export async function loginUser({ email, password }: ILoginInput) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid email or password");
  

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid email or password");

  if (!user.isVerified) {
  throw new Error("Account not verified. Please verify your email.");
}

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

  return {
    token,
    user: payload,
  };
}

export function generateTokens(payload: any) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
}

