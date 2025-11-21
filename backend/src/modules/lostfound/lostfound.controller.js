import * as LostFoundService from "./lostfound.service.js";

export const report = async (req, res) => {
  const userId = req.user.id;
  const { type, title, description, location } = req.body || {};
  if (!type || !["LOST", "FOUND"].includes(type) || !title || !description || !location) {
    const e = new Error("type (LOST|FOUND), title, description, location are required");
    e.status = 400;
    throw e;
  }
  const created = await LostFoundService.report({ userId, type, title, description, location });
  res.json(created);
};

export const list = async (req, res) => {
  const { type, resolved, page = 1, limit = 20 } = req.query;
  const data = await LostFoundService.list({
    type,
    resolved: resolved !== undefined ? String(resolved) === "true" : undefined,
    page: Number(page),
    limit: Number(limit),
  });
  res.json(data);
};

export const resolve = async (req, res) => {
  const id = Number(req.params.id);
  const requester = req.user;
  const item = await LostFoundService.getById({ id });
  if (!item) {
    const e = new Error("Record not found");
    e.status = 404;
    throw e;
  }
  if (requester.role !== "WARDEN" && item.userId !== requester.id) {
    const e = new Error("Forbidden");
    e.status = 403;
    throw e;
  }
  const updated = await LostFoundService.resolve({ id });
  res.json(updated);
};

export const getById = async (req, res) => {
  const id = Number(req.params.id);
  const item = await LostFoundService.getById({ id });
  if (!item) {
    const e = new Error("Record not found");
    e.status = 404;
    throw e;
  }
  res.json(item);
};

export const remove = async (req, res) => {
  const id = Number(req.params.id);
  const requester = req.user;
  const item = await LostFoundService.getById({ id });
  if (!item) {
    const e = new Error("Record not found");
    e.status = 404;
    throw e;
  }
  if (item.userId !== requester.id && requester.role !== "WARDEN") {
    const e = new Error("Forbidden");
    e.status = 403;
    throw e;
  }
  await LostFoundService.remove({ id });
  res.json({ id });
};

