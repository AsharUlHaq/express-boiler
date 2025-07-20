import { Request, Response } from "express";
import { ZodError } from "zod";
import { sendOtpService, verifyOtpService } from "./otp.service";
import { sendOtpSchema, verifyOtpSchema } from "./otp.schema";

export async function sendOtpController(req: Request, res: Response) {
  try {
    const { email } = sendOtpSchema.parse(req.body);
    await sendOtpService({ email });

    return res.status(200).json({
      status: 200,
      message: "OTP sent successfully",
      data: null,
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

    return res.status(400).json({
      status: 400,
      message: error.message || "Failed to send OTP",
      data: null,
      success: false,
    });
  }
}

export async function verifyOtpController(req: Request, res: Response) {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    await verifyOtpService({ email, otp });

    return res.status(200).json({
      status: 200,
      message: "OTP verified successfully. Account activated.",
      data: null,
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

    return res.status(400).json({
      status: 400,
      message: error.message || "OTP verification failed",
      data: null,
      success: false,
    });
  }
}
