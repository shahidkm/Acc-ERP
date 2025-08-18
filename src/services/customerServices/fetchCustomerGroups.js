import axios from "axios";

export const fetchCustomerGroups = async (data) => {
  const response = await axios.get(
    "https://localhost:7251/api/Customer/get-customer-groups",
    data
  );
    console.log(response.data);
  return response.data;
}