import axios from "axios";

export const getInventoryGroups = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Product/Group",

  );
    console.log(response.data);
  return response.data;
}