import axios from "axios"; 
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL, 
    timeout: 80000, 
    headers: {
        "Content-Type": "application/json", 
        Accept: "application/json"
    },
}); 

// Request Inceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("item"); 
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error); 
    }
); 

// Response Interceptor 
axiosInstance.interceptors.response.use(
    (response) => {
        return response; 
    }, 
    (error) => {
        // Handle common errors globally 
        if (error.response) {
            if (error.response.status === 500) {
                console.log("Server error. Please try again later.")
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error("Request timeout. Please try again later.")
        }
        return Promise.reject(error); 
    } 
); 

export default axiosInstance; 