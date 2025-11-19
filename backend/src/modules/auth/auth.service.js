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

export const assignRole = async ({ userId, role }) => {
  // Ensure role is one of the allowed enum values
  const allowed = ["ADMIN", "WARDEN", "STUDENT"];
  if (!allowed.includes(role)) {
    throw new Error("Invalid role");
  }

  const updated = await prisma.user.update({
    where: { id: Number(userId) },
    data: { role },
    select: { id: true, name: true, email: true, role: true, roomNumber: true, createdAt: true },
  });

  return updated;
};
