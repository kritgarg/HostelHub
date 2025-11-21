import { prisma } from "../../config/db.js";
import { sendNotification } from "../../utils/notify.js";

export const listMyNotifications = async ({ userId, unreadOnly, page = 1, limit = 20 }) => {
  const where = {
    userId: Number(userId),
    ...(unreadOnly ? { read: false } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: [{ read: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, title: true, message: true, read: true, createdAt: true },
    }),
    prisma.notification.count({ where }),
  ]);
  return { items, total, page, limit };
};

export const sendNotifications = async ({ recipients, title, message }) => {
  const userIds = new Set();

  if (recipients?.userIds && Array.isArray(recipients.userIds)) {
    recipients.userIds.forEach((id) => userIds.add(Number(id)));
  }

  if (recipients?.role) {
    if (recipients.role === "ALL") {
      const users = await prisma.user.findMany({ select: { id: true } });
      users.forEach((u) => userIds.add(u.id));
    } else if (["STUDENT", "WARDEN", "ADMIN"].includes(recipients.role)) {
      const users = await prisma.user.findMany({ where: { role: recipients.role }, select: { id: true } });
      users.forEach((u) => userIds.add(u.id));
    }
  }

  const ids = Array.from(userIds);
  if (ids.length === 0) return { sentCount: 0 };

  const created = await prisma.$transaction(async (tx) => {
    const records = await Promise.all(
      ids.map((uid) =>
        tx.notification.create({
          data: { userId: uid, title, message },
          select: { id: true, userId: true, title: true, message: true, read: true, createdAt: true },
        })
      )
    );
    return records;
  });

  // Fire-and-forget push notifications (best-effort)
  for (const rec of created) {
    // In real setup, you would look up device tokens for user
    sendNotification(rec.userId, { title: rec.title, message: rec.message }).catch(() => {});
  }

  return { sentCount: created.length };
};

export const markRead = async ({ id, userId }) => {
  const notif = await prisma.notification.findUnique({ where: { id: Number(id) } });
  if (!notif) {
    const e = new Error("Notification not found");
    e.status = 404;
    throw e;
  }
  if (notif.userId !== Number(userId)) {
    const e = new Error("Forbidden");
    e.status = 403;
    throw e;
  }
  return prisma.notification.update({
    where: { id: Number(id) },
    data: { read: true },
    select: { id: true, title: true, message: true, read: true, createdAt: true },
  });
};
