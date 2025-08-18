import axios from "axios";

export const createCustomer = async (data) => {
  const response = await axios.post("https://localhost:7251/api/Customer/create-customer", data);
  return response;
};
