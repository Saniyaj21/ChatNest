import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api", // Update this if your API is on a different host or port
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
