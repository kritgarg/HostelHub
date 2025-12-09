import * as UsersService from "./users.service.js";

export const listUsers = async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const data = await UsersService.listUsers({ role, search, page: Number(page), limit: Number(limit) });
  res.json(data);
};

export const updateMe = async (req, res) => {
  const userId = req.user.id;
  const { name, oldPassword, newPassword } = req.body || {};

  const updated = await UsersService.updateMe({
    userId,
    name,
    oldPassword,
    newPassword,
  });

  res.json(updated);
};

export const getStudentStats = async (req, res) => {
  const userId = req.user.id;
  const stats = await UsersService.getStudentStats({ userId });
  res.json(stats);
};
