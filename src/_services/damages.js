import API from "../_api";

export const getDamages = async (query) => {
  const { data } = await API.get(`/damages?${query}`);
  return data;
};

export const showDamage = async (id) => {
  try {
    const { data } = await API.get(`/damages/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createDamage = async (data) => {
  try {
    const response = await API.post("/damages", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateDamage = async (id, data) => {
  try {
    const response = await API.post(`damages/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteDamage = async (id) => {
  try {
    const response = await API.delete(`damages/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
