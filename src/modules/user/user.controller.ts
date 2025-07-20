// src/modules/user/user.controller.ts

import { Request, Response } from "express";
import { getLoggedInUser } from "./user.service";

export async function getLoggedInUserController(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
        data: null,
        success: false,
      });
    }

    const user = await getLoggedInUser(userId);

    return res.status(200).json({
      status: 200,
      message: "User profile fetched",
      data: user,
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 400,
      message: error.message || "Failed to fetch user",
      data: null,
      success: false,
    });
  }
}
