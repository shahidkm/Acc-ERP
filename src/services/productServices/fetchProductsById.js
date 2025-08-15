import axios from "axios";

export const fetchProductById = async (id) => {
  const response = await axios.get(
    `https://localhost:7251/api/Product/get-product${id}`,
  );
    console.log(response.data);
  return response.data;
};
