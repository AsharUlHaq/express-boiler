import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { z } from "zod";
import { ENV } from "./utils/env.util";
import { protect } from "./middleware/protect.middleware";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";

const app = express();
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoutes);
app.use("/", userRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Application running at http://localhost:${ENV.PORT}`);
});
