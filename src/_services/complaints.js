import API from "../_api";

export const getComplaints = async (query) => {
  const { data } = await API.get(`/complaints?${query}`);
  return data;
};

export const showComplaint = async (id) => {
  try {
    const { data } = await API.get(`/complaints/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createComplaint = async (data) => {
  try {
    const response = await API.post("/complaints", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateComplaint = async (id, data) => {
  try {
    const response = await API.post(`complaints/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteComplaint = async (id) => {
  try {
    const response = await API.delete(`complaints/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
