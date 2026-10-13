import { axiosInstance } from "./axiosInstance";

export const getAllEvents = async () => {
  try {
    const response = await axiosInstance.get("/event/all");
    return response;
  } catch (err) {
    throw err;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await axiosInstance.get(`/event/${id}`);
    return response;
  } catch (err) {
    throw err;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post("/event/create", eventData);
    return response;
  } catch (err) {
    throw err;
  }
};
