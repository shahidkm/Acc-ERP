import axios from "axios";

export const createLedgerGroup = async (data) => {
  const response = await axios.post("https://localhost:7251/api/Inventory/ledger-groups", data);
  return response;
};
