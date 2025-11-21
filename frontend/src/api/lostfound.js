import API from "./api";

export const reportLostFound = (data) => API.post("/lostfound/report", data);
export const listLostFound = () => API.get("/lostfound");
export const resolveLostFound = (id) => API.put(`/lostfound/${id}/resolve`);
export const getLostFound = (id) => API.get(`/lostfound/${id}`);
