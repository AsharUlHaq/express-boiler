import { Router } from "express";
import { signInUserHandler, signUpUserHandler } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/sign-up", signUpUserHandler);
authRoutes.post("/sign-in", signInUserHandler);

export { authRoutes };
