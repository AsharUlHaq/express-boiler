import { NextFunction, Request, Response } from "express";
import { env } from "process";
import { verify } from "jsonwebtoken";
import { ENV } from "../utils/env.util";
import { Payload } from "@prisma/client/runtime/library";

export async function protect(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new Error("Authorization header not found");
    }
    const [bearer, token] = authorizationHeader.split(" ");
    if (!bearer || bearer !== "bearer") {
      throw new Error("token not found");
    }
    if (!token) {
      throw new Error("token not found");
    }
    const payload: any = verify(token, ENV.JWT_SECRET);
    const userId = payload.id;
    (req as any)["userId"] = userId;
    next();
  } catch (error: any) {
    return res.status(400).json({
      status: 400,
      message: "unauthorized",
      data: null,
      success: false,
    });
  }
}
