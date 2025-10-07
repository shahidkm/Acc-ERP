import axios from "axios";

export const createDepartment = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Department", data);
  return response;
};
export const getDepartments = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Department",

  );
  
  return response.data;
}