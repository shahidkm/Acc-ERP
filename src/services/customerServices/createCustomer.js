import axios from "axios";

export const createCustomer = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Customer/create-customer", data);
  return response;
};
