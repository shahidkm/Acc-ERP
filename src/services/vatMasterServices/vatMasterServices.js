import axios from "axios";

export const createVatMaster = async (data) => {
  const response = await axios.post("https://localhost:7230/api/VatMaster", data);
  return response;
};
export const getVatMasters = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/VatMaster",

  );
  
  return response.data;
}