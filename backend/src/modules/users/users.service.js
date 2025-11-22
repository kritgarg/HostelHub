import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";

export const listUsers = async ({ role, search, page = 1, limit = 20 }) => {
  const where = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const updateMe = async ({ userId, name, oldPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw new Error("User not found");

  const data = {};

  if (name && name !== user.name) {
    data.name = name;
  }

  if (newPassword) {
    if (!oldPassword) {
      throw new Error("Old password is required");
    }
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      throw new Error("Old password is incorrect");
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    data.password = hashed;
  }

  if (Object.keys(data).length === 0) {
    // Nothing to update; return current safe user
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      roomNumber: user.roomNumber,
      createdAt: user.createdAt,
    };
  }

  const updated = await prisma.user.update({
    where: { id: Number(userId) },
    data,
    select: { id: true, name: true, email: true, role: true, roomNumber: true, createdAt: true },
  });

  return updated;
};

export const getStudentStats = async ({ userId }) => {
  const [pendingLeaves, activeComplaints, activePolls] = await Promise.all([
    prisma.leave.count({ where: { userId: Number(userId), status: "PENDING" } }),
    prisma.complaint.count({ where: { userId: Number(userId), NOT: { status: "RESOLVED" } } }),
    prisma.poll.count(), // Total active polls (could filter by date if needed)
  ]);

  return { pendingLeaves, activeComplaints, activePolls };
};
