import axios from "axios";

export const createArea = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Area", data);
  return response;
};
export const getAreas = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Area",

  );
  
  return response.data;
}