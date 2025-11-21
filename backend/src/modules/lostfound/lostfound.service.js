import { prisma } from "../../config/db.js";

export const report = async ({ userId, type, title, description, location }) => {
  return prisma.lostFound.create({
    data: { userId: Number(userId), type, title, description, location },
    select: {
      id: true,
      userId: true,
      type: true,
      title: true,
      description: true,
      location: true,
      resolved: true,
      createdAt: true,
    },
  });
};

export const list = async ({ type, resolved, page = 1, limit = 20 }) => {
  const where = {
    ...(type ? { type } : {}),
    ...(resolved !== undefined ? { resolved } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.lostFound.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        userId: true,
        type: true,
        title: true,
        description: true,
        location: true,
        resolved: true,
        createdAt: true,
        user: { select: { id: true, name: true, roomNumber: true } },
      },
    }),
    prisma.lostFound.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const resolve = async ({ id }) => {
  return prisma.lostFound.update({
    where: { id: Number(id) },
    data: { resolved: true },
    select: {
      id: true,
      userId: true,
      type: true,
      title: true,
      description: true,
      location: true,
      resolved: true,
      createdAt: true,
    },
  });
};

export const getById = async ({ id }) => {
  return prisma.lostFound.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      userId: true,
      type: true,
      title: true,
      description: true,
      location: true,
      resolved: true,
      createdAt: true,
      user: { select: { id: true, name: true, roomNumber: true } },
    },
  });
};

export const remove = async ({ id }) => {
  return prisma.lostFound.delete({ where: { id: Number(id) }, select: { id: true } });
};

