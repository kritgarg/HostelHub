import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@HostelHub:token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export default API;
