import axios from "axios";

export const createCurrency = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Currency", data);
  return response;
};
export const getCurrencies = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Currency",

  );
  
  return response.data;
}