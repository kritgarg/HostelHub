import { prisma } from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ENV } from "../../config/env.js";

export const register = async (data) => {
  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: { ...data, password: hashed },
  });
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  return jwt.sign(
    { id: user.id, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const me = async (userId) => {
  return prisma.user.findUnique({ where: { id: userId } });
};
