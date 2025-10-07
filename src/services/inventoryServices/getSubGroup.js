import axios from "axios";

export const getSubGroup = async (data) => {
  const response = await axios.get("https://localhost:7230/api/Product/subgroups", data);
  return response;
};
