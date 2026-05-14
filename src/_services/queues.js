import API from "../_api";

export const getQueues = async (query) => {
  const { data } = await API.get(`/queues?${query}`);
  return data;
};

export const getCurrentQ = async () => {
  const { data } = await API.get(`/queues/current`);
  return data;
};

export const showQueue = async (id) => {
  try {
    const { data } = await API.get(`/queues/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateQueue = async (id, data) => {
  try {
    const response = await API.post(`queues/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteQueue = async (id) => {
  try {
    const response = await API.delete(`queues/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
