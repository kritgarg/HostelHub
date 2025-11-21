import API from "./api";

export const createPoll = (data) => API.post("/polls", data);
export const listPolls = () => API.get("/polls");
export const getPoll = (id) => API.get(`/polls/${id}`);
export const vote = (pollId, data) => API.post(`/polls/vote/${pollId}`, data);
export const results = (id) => API.get(`/polls/results/${id}`);
export const deletePoll = (id) => API.delete(`/polls/${id}`);
