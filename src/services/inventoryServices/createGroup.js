import axios from "axios";

export const createGroup = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/groups", data);
  return response;
};



export const createSubGroup = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/subgroups", data);
  return response;
};

export const createItemMaster = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/items", data);
  return response;
};

export const createQuotationSale = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/QuotationSale", data);
  return response;
};

export const createQuotationRental = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/QuotationRental", data);
  return response;
};

export const getQuotationSales = async () => {
  const response = await axios.get("https://localhost:7230/api/Product/QuotationSale");
  return response.data;
};
export const getGoodsReceiptNotes = async () => {
  const response = await axios.get("https://localhost:7230/api/Product/QuotationSale");
  return response.data;
};

export const getQuotationRentals = async () => {
  const response = await axios.get("https://localhost:7230/api/Product/QuotationRental");
  return response.data;
};

export const createSalesOrder = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/SalesOrders", data);
  return response;
};

export const createPurchaseOrder = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/purchase-orders", data);
  return response;
};
export const getSalesOrders = async () => {
  const response = await axios.get("https://localhost:7230/api/Product/SalesOrders");
  return response.data;
};

export const getPurchaseOrders = async () => {
  const response = await axios.get("https://localhost:7230/api/Product/purchase-orders");
  return response.data;
};
export const createDeliveryOrder = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/DeliveryOrders", data);
  return response;
};
