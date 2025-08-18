import axios from "axios";

export const fetchLedgerGroups = async () => {
  const response = await axios.get(
    "https://localhost:7251/api/Inventory/ledger-groups",

  );
    console.log(response.data);
  return response.data;
}