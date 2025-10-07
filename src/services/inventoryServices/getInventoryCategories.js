import axios from "axios";

export const getInventoryCategories = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Product/categories",

  );
    console.log(response.data);
  return response.data;
}

export const getInventorySubCategories = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Product/subcategories",

  );
    console.log(response.data);
  return response.data;
}

export const getInventoryUnits = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Product/items",

  );
    console.log(response.data);
  return response.data;
}


export const getInventoryItemMasters = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Product/units",

  );
    console.log(response.data);
  return response.data;
}