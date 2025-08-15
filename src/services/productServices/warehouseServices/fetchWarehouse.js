import axios from "axios";

export const fetchWarehouse = async (data) => {
  const response = await axios.get(
    "https://localhost:7251/api/Warehouse/get-warehouses",
    data
  );
    console.log(response.data);
  return response.data;
};
