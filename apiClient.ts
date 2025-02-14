import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "https://temimartapi.onrender.com/",
  headers: {
    "Content-type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const fetchUserInfo = await AsyncStorage.getItem("userInfo");
    if (fetchUserInfo)
      config.headers.authorization = `Bearer ${
        JSON.parse(fetchUserInfo!).token
      }`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default apiClient;
