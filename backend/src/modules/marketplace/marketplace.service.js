import { prisma } from "../../config/db.js";

export const createItem = async ({ userId, title, description, price }) => {
  return prisma.marketplaceItem.create({
    data: { userId: Number(userId), title, description, price: Number(price) },
    select: { id: true, userId: true, title: true, description: true, price: true, status: true, createdAt: true },
  });
};

export const listItems = async ({ search, minPrice, maxPrice, page = 1, limit = 20 }) => {
  const where = {
    status: "AVAILABLE",
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: Number(minPrice) } : {}),
            ...(maxPrice !== undefined ? { lte: Number(maxPrice) } : {}),
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.marketplaceItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, userId: true, title: true, description: true, price: true, status: true, createdAt: true },
    }),
    prisma.marketplaceItem.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const getItemById = async ({ id }) => {
  return prisma.marketplaceItem.findUnique({
    where: { id: Number(id) },
    select: { id: true, userId: true, title: true, description: true, price: true, status: true, createdAt: true },
  });
};

export const updateItem = async ({ id, title, description, price, status }) => {
  const data = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (status !== undefined) data.status = status;
  return prisma.marketplaceItem.update({
    where: { id: Number(id) },
    data,
    select: { id: true, userId: true, title: true, description: true, price: true, status: true, createdAt: true },
  });
};

export const deleteItem = async ({ id }) => {
  return prisma.marketplaceItem.delete({ where: { id: Number(id) }, select: { id: true } });
};

export const markSold = async ({ id }) => {
  return prisma.marketplaceItem.update({
    where: { id: Number(id) },
    data: { status: "SOLD" },
    select: { id: true, userId: true, title: true, description: true, price: true, status: true, createdAt: true },
  });
};

