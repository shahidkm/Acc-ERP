import axios from "axios";

export const createSalesman = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Salesman", data);
  return response;
};
export const getSalesmans = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Salesman",

  );
  
  return response.data;
}