import axios from "axios";

export const createVoucher = async (data) => {
  const response = await axios.post("https://localhost:7230/api/vouchers/receipt", data);
  return response;
};
export const getVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/receipt",

  );
  
  return response.data;
}