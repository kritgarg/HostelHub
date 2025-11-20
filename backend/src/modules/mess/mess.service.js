import { prisma } from "../../config/db.js";

export const createMenu = async ({ day, breakfast, lunch, dinner }) => {
  return prisma.messMenu.create({
    data: { day, breakfast, lunch, dinner },
    select: { id: true, day: true, breakfast: true, lunch: true, dinner: true, createdAt: true },
  });
};

export const updateMenu = async ({ id, day, breakfast, lunch, dinner }) => {
  const data = {};
  if (day) data.day = day;
  if (breakfast) data.breakfast = breakfast;
  if (lunch) data.lunch = lunch;
  if (dinner) data.dinner = dinner;
  if (Object.keys(data).length === 0) return prisma.messMenu.findUnique({ where: { id: Number(id) }, select: { id: true, day: true, breakfast: true, lunch: true, dinner: true, createdAt: true } });
  return prisma.messMenu.update({
    where: { id: Number(id) },
    data,
    select: { id: true, day: true, breakfast: true, lunch: true, dinner: true, createdAt: true },
  });
};

export const deleteMenu = async ({ id }) => {
  return prisma.messMenu.delete({ where: { id: Number(id) }, select: { id: true } });
};

export const listMenus = async ({ day, page = 1, limit = 50 }) => {
  const where = {
    ...(day ? { day } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.messMenu.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, day: true, breakfast: true, lunch: true, dinner: true, createdAt: true },
    }),
    prisma.messMenu.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const createFeedback = async ({ userId, menuId, rating }) => {
  // Optionally enforce one feedback per user per menu by upserting if unique index exists.
  return prisma.messFeedback.create({
    data: { userId: Number(userId), menuId: Number(menuId), rating: Number(rating) },
    select: { id: true, userId: true, menuId: true, rating: true, createdAt: true },
  });
};

export const analytics = async ({ from, to }) => {
  const where = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const grouped = await prisma.messFeedback.groupBy({
    by: ["menuId"],
    where,
    _count: { _all: true },
    _sum: { rating: true },
  });

  // Derive likes/dislikes from total count (n) and sum of +/-1 (s)
  const results = await Promise.all(
    grouped.map(async (g) => {
      const n = g._count._all || 0;
      const s = g._sum.rating || 0;
      const likes = Math.round((n + s) / 2);
      const dislikes = Math.round((n - s) / 2);
      return {
        menuId: g.menuId,
        likes,
        dislikes,
        score: s,
      };
    })
  );

  return results;
};

