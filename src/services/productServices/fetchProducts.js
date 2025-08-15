import axios from "axios";

export const fetchProducts = async (data) => {
  const response = await axios.get(
    "https://localhost:7251/api/Product/get-product",
    data
  );
    console.log(response.data);
  return response.data;
};
