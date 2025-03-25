import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "https://temimartapi.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo"); // Await the stored user info
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`; // Capital "A" in Authorization
        }
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
