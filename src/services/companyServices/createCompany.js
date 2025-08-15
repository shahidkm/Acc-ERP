import axios from "axios";

export const createCompany = async (data) => {
  const response = await axios.post("https://localhost:7251/api/Company/create-company", data);
  return response;
};
