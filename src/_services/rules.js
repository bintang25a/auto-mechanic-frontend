import API from "../_api";

export const getRules = async () => {
  const { data } = await API.get(`/rules`);
  return data;
};

export const createRule = async (data) => {
  try {
    const response = await API.post("/rules", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteRule = async (id) => {
  try {
    const response = await API.delete(`rules/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
