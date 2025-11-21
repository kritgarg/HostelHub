import API from "./api";

export const myNotifications = () => API.get("/notifications");
export const sendNotifications = (data) => API.post("/notifications/send", data);
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
