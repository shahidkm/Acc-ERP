import axios from "axios";

export const fetchCustomers = async (data) => {
  const response = await axios.get(
    "https://localhost:7230/api/Customer/Get-customers",
    data
  );
    console.log(response.data);
  return response.data;
}


export const fetchCustomerAccountMasters = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Account/CustomerAccountMaster",
    data
  );
    console.log("SSSSSS",response.data);
  return response.data;
}

export const fetchSupplierAccountMasters = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Account/SupplierAccountMaster",
    data
  );
    console.log("SSSSSS",response.data);
  return response.data;
}