import axios from "axios";

export const fetchCustomers = async (data) => {
  const response = await axios.get(
    "https://localhost:7251/api/Customer/Get-customers",
    data
  );
    console.log(response.data);
  return response.data;
}