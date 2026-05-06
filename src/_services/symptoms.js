import API from "../_api";

export const getSymptoms = async (query) => {
  const { data } = await API.get(`/symptoms?${query}`);
  return data;
};

export const showSymptom = async (id) => {
  try {
    const { data } = await API.get(`/symptoms/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createSymptom = async (data) => {
  try {
    const response = await API.post("/symptoms", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateSymptom = async (id, data) => {
  try {
    const response = await API.post(`symptoms/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteSymptom = async (id) => {
  try {
    const response = await API.delete(`symptoms/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
