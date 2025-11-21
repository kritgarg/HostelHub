import API from "./api";

export const createItem = (data) => API.post("/marketplace/item", data);
export const listItems = () => API.get("/marketplace/items");
export const getItem = (id) => API.get(`/marketplace/item/${id}`);
export const updateItem = (id, data) => API.put(`/marketplace/item/${id}`, data);
export const markSold = (id) => API.put(`/marketplace/item/${id}/mark-sold`);
export const deleteItem = (id) => API.delete(`/marketplace/item/${id}`);
