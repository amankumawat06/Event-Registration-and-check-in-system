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

export const getMe = async () => {
  try {
    const response = await axiosInstance.get("/auth/user/get-me");
    return response;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/user/logout");
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/auth/user/all");
    return response;
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/auth/user/${userId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/auth/user/delete/${userId}`);
    return response;
  } catch (err) {
    throw err;
  }
};
