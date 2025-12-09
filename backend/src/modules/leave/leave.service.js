import { prisma } from "../../config/db.js";

export const apply = async ({ userId, from, to, reason }) => {
  const leave = await prisma.leave.create({
    data: {
      userId: Number(userId),
      fromDate: from,
      toDate: to,
      reason,
      
    },
    select: {
      id: true,
      status: true,
      fromDate: true,
      toDate: true,
    },
  });
  return leave;
};

export const listMyLeaves = async ({ userId, status, page = 1, limit = 20 }) => {
  const where = {
    userId: Number(userId),
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.leave.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        fromDate: true,
        toDate: true,
        reason: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.leave.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const listPending = async ({ page = 1, limit = 20, student, room }) => {
  const where = {
    status: "PENDING",
    user: {
      ...(student ? { name: { contains: student, mode: "insensitive" } } : {}),
      ...(room ? { roomNumber: { equals: room } } : {}),
    },
  };

  const [items, total] = await Promise.all([
    prisma.leave.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        fromDate: true,
        toDate: true,
        reason: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, roomNumber: true } },
      },
    }),
    prisma.leave.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const approve = async ({ id }) => {
  const existing = await prisma.leave.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    const e = new Error("Leave not found");
    e.status = 404;
    throw e;
  }
  const updated = await prisma.leave.update({
    where: { id: Number(id) },
    data: { status: "APPROVED" },
    select: { id: true, status: true, fromDate: true, toDate: true, userId: true },
  });
  return updated;
};

export const reject = async ({ id }) => {
  const existing = await prisma.leave.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    const e = new Error("Leave not found");
    e.status = 404;
    throw e;
  }
  const updated = await prisma.leave.update({
    where: { id: Number(id) },
    data: { status: "REJECTED" },
    select: { id: true, status: true, fromDate: true, toDate: true, userId: true },
  });
  return updated;
};

export const getById = async ({ id }) => {
  return prisma.leave.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      userId: true,
      fromDate: true,
      toDate: true,
      reason: true,
      status: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true, roomNumber: true } },
    },
  });
};

export const deleteLeave = async ({ id, userId }) => {
  const existing = await prisma.leave.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    const e = new Error("Leave not found");
    e.status = 404;
    throw e;
  }
  if (existing.userId !== userId) {
    const e = new Error("Forbidden");
    e.status = 403;
    throw e;
  }

  
  await prisma.leave.delete({ where: { id: Number(id) } });
  return { success: true };
};
