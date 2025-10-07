import axios from "axios";

export const createPurchaseInvoice = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Invoice/PurchaseInvoice", data);
  return response;
};


export const createSalesInvoice = async (data) => {
  const response = await axios.post("https://localhost:7230/api/vouchers/sales-vouchers", data);
  return response;
};
export const getPurchaseInvoices = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/purchase-vouchers",

  );
  
  return response.data;
}



export const getSalesInvoices = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/sales-vouchers",

  );
  
  return response.data;
}


export const getPurchaseInvoiceById = async (id) => {
  const response = await axios.get(
    `https://localhost:7230/api/Invoice/PurchaseInvoice${id}`,

  );
  
  return response.data;
}


export const createPurchaseReturnInvoice = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Invoice/PurchaseReturnInvoice", data);
  return response;
};
export const getPurchaseReturnInvoices = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/purchase-return-voucher",

  );
  
  return response.data;
}

export const getPurchaseReturnInvoiceById = async (id) => {
  const response = await axios.get(
    `https://localhost:7230/api/Invoice/PurchaseReturnInvoice${id}`,

  );
  
  return response.data;
}