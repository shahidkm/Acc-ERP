import axios from "axios";

export const fetchVendors = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Vendor/all",

  );
    console.log(response.data);
  return response.data;
}