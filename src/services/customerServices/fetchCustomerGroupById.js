import axios from "axios";

export const fetchCustomerGroupById= async (id=1) => {
  const response = await axios.get(
    `https://localhost:7230/api/Customer/get-customer-group?id=${id}`
    
  );
    console.log(response.data);
  return response.data;
}