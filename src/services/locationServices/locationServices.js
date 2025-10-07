import axios from "axios";

export const createLocation = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Location", data);
  return response;
};
export const getLocations = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Location",

  );
  
  return response.data;
}