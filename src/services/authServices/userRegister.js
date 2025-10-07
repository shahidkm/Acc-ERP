import axios from "axios";

export const userRegister = async (data) => {
  const response = await axios.post(
    "https://localhost:7230/api/Auth/register",
    data
  );
    console.log(response.data);
  return response.data;
};
