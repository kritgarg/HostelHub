import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import leaveRoutes from "./modules/leave/leave.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { prisma } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/leave", leaveRoutes);
// add rest

app.use(errorHandler);


app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
export default {app, prisma};
