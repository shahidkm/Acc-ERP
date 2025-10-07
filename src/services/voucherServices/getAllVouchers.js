import axios from "axios";

export const fetchAllVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Voucher/legacy/all-vouchers",

  );
    console.log(response.data);
  return response.data;
}