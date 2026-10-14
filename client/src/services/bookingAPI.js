import { axiosInstance } from "./axiosInstance";

export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post("/booking/create", bookingData);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getMyBookings = async () => {
  try {
    const response = await axiosInstance.get("/booking/my-bookings");
    return response;
  } catch (err) {
    throw err;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.delete(`/booking/delete/${bookingId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get("/booking/all");
    return response;
  } catch (err) {
    throw err;
  }
};

export const markBookingCheckedIn = async (bookingId) => {
  try {
    const response = await axiosInstance.patch(`/booking/update/${bookingId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
