import { prisma } from "../../config/db.js";

export const createComplaint = async ({ userId, title, description }) => {
  const created = await prisma.complaint.create({
    data: {
      userId: Number(userId),
      title,
      description,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });
  return created;
};

export const listMyComplaints = async ({ userId, page = 1, limit = 20, status }) => {
  const where = {
    userId: Number(userId),
    ...(status ? { status } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.complaint.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const listComplaints = async ({ page = 1, limit = 20, status }) => {
  const where = {
    ...(status ? { status } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, roomNumber: true } },
      },
    }),
    prisma.complaint.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const updateComplaint = async ({ id, status }) => {
  const allowed = ["IN_PROGRESS", "RESOLVED"];
  if (!allowed.includes(status)) {
    const e = new Error("Invalid status");
    e.status = 400;
    throw e;
  }
  const updated = await prisma.complaint.update({
    where: { id: Number(id) },
    data: { status },
    select: { id: true, title: true, description: true, status: true, createdAt: true, userId: true },
  });
  return updated;
};

export const getComplaintById = async ({ id }) => {
  return prisma.complaint.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      userId: true,
      user: { select: { id: true, name: true, email: true, roomNumber: true } },
    },
  });
};
