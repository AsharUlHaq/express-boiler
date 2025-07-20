import { Request, Response } from "express";
import { ZodError, ZodIssueCode } from "zod";
import { userSignInSchema, userSignUpSchema } from "./auth.schema";
import { loginUser, signUp, findUserByEmail } from "./auth.service";
import { sendOtpToEmail } from "../otp/otp.service";

export async function signUpUserHandler(req: Request, res: Response) {
  try {
    const data = userSignUpSchema.parse({
      ...req.body,
      phone: req.body.phone.toString(),
    });

    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: "Email already in use",
        data: null,
        success: false,
      });
    }

    const user = await signUp(data);

    // Send OTP to user's email
    await sendOtpToEmail(user.email);

    return res.status(201).json({
      status: 201,
      message: "User created successfully. OTP sent to email for verification.",
      data: {
        id: user.id,
        email: user.email,
      },
      success: true,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: 400,
        message: `${error.errors[0].path[0]} is ${error.errors[0].message}`,
        data: null,
        success: false,
      });
    }

    return res.status(500).json({
      status: 500,
      message: error.message || "Internal server error",
      data: null,
      success: false,
    });
  }
}

export async function signInUserHandler(req: Request, res: Response) {
  try {
    const data = userSignInSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      data: result,
      success: true,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const unrecognized = error.errors.find(
        (e) => e.code === ZodIssueCode.unrecognized_keys
      );

      const message = unrecognized
        ? "Only email and password are allowed in the login request"
        : `${error.errors[0].path[0]} is ${error.errors[0].message}`;

      return res.status(400).json({
        status: 400,
        message,
        data: null,
        success: false,
      });
    }

    return res.status(401).json({
      status: 401,
      message: error.message || "Authentication failed",
      data: null,
      success: false,
    });
  }
}
