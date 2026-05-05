import API from "../_api";
import message from "../_utilities/errorMessage";

export const getUsers = async (query) => {
  const { data } = await API.get(`/users?${query}`);
  return data;
};

export const showUser = async (id) => {
  try {
    const { data } = await API.get(`/users/${id}`);
    return data.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const createUser = async (data) => {
  try {
    const response = await API.post("/users", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await API.post(`users/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw message(error);
  }
};
