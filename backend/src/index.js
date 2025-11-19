import express from "express";
import cors from "cors";
// import { errorHandler } from "./middleware/errorHandler.js";
import { ENV } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { prisma } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
// add rest

// app.use(errorHandler);


app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
export default {app, prisma};
