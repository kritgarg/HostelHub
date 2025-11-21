import * as AuthService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    res.json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Email already registered" });
    }
    next(error);
  }
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
