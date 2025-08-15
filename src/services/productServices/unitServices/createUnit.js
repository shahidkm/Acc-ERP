import axios from "axios";

export const createUnit = async (data) => {
  const response = await axios.post(
    "https://localhost:7251/api/Unit/create-unit",
    data
  );
    console.log(response.data);
  return response.data;
};
