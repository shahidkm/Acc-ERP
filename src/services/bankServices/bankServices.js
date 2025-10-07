import axios from "axios";

export const createBank = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Bank", data);
  return response;
};
export const getBanks = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Bank",

  );
  
  return response.data;
}