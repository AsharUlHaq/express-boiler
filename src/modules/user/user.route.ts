import { Router } from "express";
import { getLoggedInUserController } from "./user.controller";
import { protect } from "../../middleware/protect.middleware";

const userRoutes = Router();

userRoutes.get("/", protect, getLoggedInUserController);

export { userRoutes };
