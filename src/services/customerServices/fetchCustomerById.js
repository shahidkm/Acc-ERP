import axios from "axios";
var id=1;
export const fetchCustomerById = async () => {
  const response = await axios.get(
   `https://localhost:7230/api/Customer/Get-customer?Id=${id}`
  );
    console.log(response.data);
  return response.data;
}