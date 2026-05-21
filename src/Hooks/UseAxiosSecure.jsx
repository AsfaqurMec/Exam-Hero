import React from "react";
import axios from "axios";

// Backend API axios instance
const axiosSecure = axios.create({
  baseURL: "https://exam-hero-server-main.vercel.app",
});

// Add request interceptor to include auth token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const UseAxiosSecure = () => {
  return axiosSecure;
};

export default UseAxiosSecure;
