import API from "./api";

export const createComplaint = (data) => API.post("/complaints", data);
export const myComplaints = () => API.get("/complaints/my");
export const listComplaints = () => API.get("/complaints");
export const updateComplaint = (id, data) => API.put(`/complaints/update/${id}`, data);
export const getComplaint = (id) => API.get(`/complaints/${id}`);
