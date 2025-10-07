import axios from "axios";

export const createCategory = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/categories", data);
  return response;
};

export const createSubCategory = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/subcategories", data);
  return response;
};

export const createUnit = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/units", data);
  return response;
};