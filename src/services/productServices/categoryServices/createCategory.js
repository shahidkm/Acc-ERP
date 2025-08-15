import axios from "axios";

export const createCategory = async (data) => {
  const response = await axios.post(
    "https://localhost:7251/api/ProductWarehouse/create-product-warehouse",
    data
  );
    console.log(response.data);
  return response.data;
};
