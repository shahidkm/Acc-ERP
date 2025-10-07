import axios from "axios";

export const createJobMaster = async (data) => {
  const response = await axios.post("https://localhost:7230/api/JobMaster", data);
  return response;
};
export const getJobMasters = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/JobMaster",

  );
  
  return response.data;
}