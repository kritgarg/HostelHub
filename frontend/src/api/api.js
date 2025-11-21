import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  // baseURL: "http://10.110.67.133:5001/api",
  baseURL: "http://11.6.2.205:5001/api",
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@HostelHub:token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper for profile placeholder images using ui-avatars
export const getAvatarUrl = (firstName = "", lastName = "") => {
  const name = `${(firstName || "").trim()} ${(lastName || "").trim()}`.trim() || "User";
  const encoded = encodeURIComponent(name.replace(/\s+/g, " "));
  return `https://ui-avatars.com/api/?name=${encoded}`;
};

export default API;
