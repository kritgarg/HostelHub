import * as NotificationsService from "./notifications.service.js";

export const listMyNotifications = async (req, res) => {
  const userId = req.user.id;
  const { unreadOnly, page = 1, limit = 20 } = req.query;
  const data = await NotificationsService.listMyNotifications({
    userId,
    unreadOnly: unreadOnly !== undefined ? String(unreadOnly) === "true" : undefined,
    page: Number(page),
    limit: Number(limit),
  });
  res.json(data);
};

export const sendNotifications = async (req, res) => {
  const { recipients, title, message } = req.body || {};
  if (!recipients || !title || !message) {
    const e = new Error("recipients, title and message are required");
    e.status = 400;
    throw e;
  }
  const result = await NotificationsService.sendNotifications({ recipients, title, message });
  res.json(result);
};

export const markRead = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.id;
  const updated = await NotificationsService.markRead({ id, userId });
  res.json(updated);
};
