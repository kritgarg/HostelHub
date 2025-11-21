import API from "./api";

export const applyLeave = (data) => API.post("/leave/apply", data);
export const myLeaves = () => API.get("/leave/my-leaves");
export const pendingLeaves = () => API.get("/leave/pending");
export const approveLeave = (id) => API.put(`/leave/approve/${id}`);
export const rejectLeave = (id) => API.put(`/leave/reject/${id}`);

