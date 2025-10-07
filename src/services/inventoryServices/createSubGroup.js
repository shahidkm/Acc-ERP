import axios from "axios";

export const createSubGroup = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/subgroups", data);
  return response;
};
