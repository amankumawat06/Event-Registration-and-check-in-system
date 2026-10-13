import { axiosInstance } from "./axiosInstance";

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/user/register", userData);
    return response;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/user/login", credentials);
    return response;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/user/logout");
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/auth/users");
    return response;
  } catch (err) {
    throw err;
  }
};
