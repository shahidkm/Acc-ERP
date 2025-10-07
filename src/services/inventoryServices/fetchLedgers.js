import axios from "axios";

export const fetchLedgers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/AccountingMasters/ledgers",

  );
    console.log(response.data);
  return response.data;
}