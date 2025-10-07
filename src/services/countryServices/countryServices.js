import axios from "axios";

export const createCountry = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Country", data);
  return response;
};
export const getCountries = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Country",

  );
  
  return response.data;
}