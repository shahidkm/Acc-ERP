import axios from "axios";

export const userRegister = async (data) => {
  const response = await axios.post(
    "https://localhost:7251/api/Auth/register",
    data
  );
    console.log(response.data);
  return response.data;
};
