import * as UsersService from "./users.service.js";

// PATCH /api/users/me
// Body can include: { name?, oldPassword?, newPassword? }
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
