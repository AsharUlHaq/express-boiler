import { z } from "zod";

export const userSignUpSchema = z.object({
  name: z.string().min(3).max(25),
  email: z.string().email().max(50),
  password: z.string().min(8).max(25),
  phone: z.string().min(10).max(15),
  city: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
}).strict();

export type SignUpType = z.infer<typeof userSignUpSchema>;

export const userSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(25),
}).strict(); // 👈 Enforces that only these two fields are allowed

export type SignInType = z.infer<typeof userSignInSchema>;
