import axios from "axios";

export const createAccountCategory = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Account/AccountCategory", data);
  return response;
};

export const getAccountCategories = async () => {
  const response = await axios.get("https://localhost:7230/api/Account/AccountCategory");
  return response.data;
};


export const getAccountGroups = async () => {
  const response = await axios.get("https://localhost:7230/api/Account/AccountGroups");
  return response.data;
};

export const createAccountGroup = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Account/AccountGroups", data);
  return response;
};

export const createAccountMaster = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Account/AccountMaster", data);
  return response;
};
export const getAccountMasters = async () => {
  const response = await axios.get("https://localhost:7230/api/Account/AccountMaster");
  return response.data;
};
export const getAccountEnquiries = async () => {
  const response = await axios.get("https://localhost:7230/api/Account/account-enquiry");
  return response.data;
};

export const getAddressList = async (num) => {
  const response = await axios.get(`https://localhost:7230/api/Account/AccountMasterByName?num=${num}`);
  return response.data;
};