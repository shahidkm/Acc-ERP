import axios from "axios";

export const createCustomerGroup = async (data) => {
  const response = await axios.post("https://localhost:7251/api/Customer/create-customer-group", data);
  return response;
};
