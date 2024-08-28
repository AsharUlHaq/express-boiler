import { Request, Response } from "express";
import prisma from "../../utils/db.util";
import { getLoggedInUser } from "./user.service";

export async function getLoggedInUserController(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const user = await getLoggedInUser(userId);
    return res
      .status(200)
      .json({ status: 200, message: "success", data: user, success: true });
  } catch (error: any) {
    return res
      .status(400)
      .json({
        status: 400,
        message: error.message,
        data: null,
        success: false,
      });
  }
}
