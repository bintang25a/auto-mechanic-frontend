import API from "../_api";

export const adminPageRules = async () => {
  const { data } = await API.get(`/admin-page-rules`);
  return data;
};
