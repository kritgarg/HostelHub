import API from "./api";

export const updateMe = (data) => API.patch("/users/me", data);
export const adminStats = () => API.get("/admin/stats");
export const health = () => API.get("/health");
