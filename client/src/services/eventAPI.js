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

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axiosInstance.put(
      `/event/update/${eventId}`,
      eventData,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`/event/delete/${eventId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
