import axios from "axios";

export const createCustomerGroup = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Customer/create-customer-group", data);
  return response;
};
