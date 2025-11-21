import API from "./api";

export const createMenu = (data) => API.post("/mess/menu", data);
export const updateMenu = (id, data) => API.put(`/mess/menu/${id}`, data);
export const deleteMenu = (id) => API.delete(`/mess/menu/${id}`);
export const listMenus = () => API.get("/mess/menu");
export const createFeedback = (data) => API.post("/mess/feedback", data);
export const analytics = () => API.get("/mess/analytics");
