import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { z } from "zod";
import { ENV } from "./utils/env.util";
import { protect } from "./middleware/protect.middleware";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { Role } from "@prisma/client";
import { otpRoutes } from "./modules/otp/otp.route";

const app = express();
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoutes);
app.use("/", userRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Application running at http://localhost:${ENV.PORT}`);
});

app.use("/api/otp", otpRoutes);

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}
