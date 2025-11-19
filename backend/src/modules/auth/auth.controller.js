import * as AuthService from "./auth.service.js";

export const register = async (req, res) => {
  const user = await AuthService.register(req.body);
  res.json(user);
};

export const login = async (req, res) => {
  const token = await AuthService.login(req.body);
  res.json({ token });
};

export const me = async (req, res) => {
  const user = await AuthService.me(req.user.id);
  res.json(user);
};

export const assignRole = async (req, res) => {
  const { userId, role } = req.body;
  const user = await AuthService.assignRole({ userId, role });
  res.json(user);
};
