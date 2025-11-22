import { prisma } from "../../config/db.js";
import { sendNotification } from "../../utils/notify.js";

export const listMyNotifications = async ({ userId, unreadOnly, page = 1, limit = 20 }) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw new Error("User not found");

  // Fetch individual notices AND global notices for my role
  const where = {
    OR: [
      { userId: Number(userId) },
      { targetRole: user.role },
      { targetRole: null } // Global (ALL)
    ]
  };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reads: {
          where: { userId: Number(userId) },
          select: { id: true }
        }
      }
    }),
    prisma.notification.count({ where }),
  ]);

  // Process read status
  const items = notifications.map(n => {
    let isRead = false;
    if (n.userId) {
      // Individual notice: check 'read' field
      isRead = n.read;
    } else {
      // Global notice: check if 'reads' array has an entry
      isRead = n.reads.length > 0;
    }

    return {
      id: n.id,
      title: n.title,
      message: n.message,
      read: isRead,
      createdAt: n.createdAt
    };
  });

  // Filter unreadOnly in memory (since we can't easily query mixed read status in DB efficiently without raw SQL)
  // Note: For pagination to work perfectly with unreadOnly, we'd ideally use raw SQL or a view.
  // For now, we'll return the mixed list, but if unreadOnly is true, we filter the result.
  // This might return fewer than 'limit' items.
  const finalItems = unreadOnly ? items.filter(i => !i.read) : items;

  return { items: finalItems, total, page, limit };
};

export const sendNotifications = async ({ recipients, title, message }) => {
  // 1. Global/Role-based Notice
  if (recipients?.role && ["ALL", "STUDENT", "WARDEN", "ADMIN"].includes(recipients.role)) {
    const targetRole = recipients.role === "ALL" ? null : recipients.role;
    
    const created = await prisma.notification.create({
      data: {
        targetRole,
        title,
        message,
        userId: null // Global
      }
    });
    return { sentCount: 1, global: true };
  }

  // 2. Individual Notices (Legacy/Specific Users)
  const userIds = new Set();
  if (recipients?.userIds && Array.isArray(recipients.userIds)) {
    recipients.userIds.forEach((id) => userIds.add(Number(id)));
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
    if (rec.userId) {
      sendNotification(rec.userId, { title: rec.title, message: rec.message }).catch(() => {});
    }
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

  // If individual notice
  if (notif.userId) {
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
  } else {
    // Global notice: Create a read record if not exists
    try {
      await prisma.notificationRead.create({
        data: {
          userId: Number(userId),
          notificationId: Number(id)
        }
      });
    } catch (e) {
      // Ignore unique constraint violation (already read)
    }
    return { id: Number(id), read: true };
  }
};
