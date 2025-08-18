import axios from "axios";

export const fetchCustomerGroupMembers = async (data) => {
  const response = await axios.get(
    "https://localhost:7251/api/Customer/get-customer-group-members",
    data
  );
    console.log(response.data);
  return response.data;
}