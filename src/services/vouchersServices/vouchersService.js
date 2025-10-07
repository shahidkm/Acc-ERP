import axios from "axios";

export const createVoucher = async (data) => {
  const response = await axios.post("https://localhost:7230/api/vouchers/receipt", data);
  return response;
};

export const createCheque = async (data) => {
  const response = await axios.post("https://localhost:7230/api/Product/Cheque", data);
  return response;
};

export const createPaymentVoucher = async (data) => {
  const response = await axios.post("https://localhost:7230/api/vouchers/payment", data);
  return response;
};


export const createPurchaseNonStockVoucher = async (data) => {
  const response = await axios.post("https://localhost:7230/api/vouchers/purchase-non-stock", data);
  return response;
};

export const createSalesNonStockVoucher = async (data) => {
  const response = await axios.post("https://localhost:7230/api/vouchers/sales-non-stock", data);
  return response;
};
export const createJournalVoucher = async (data) => {
  const response = await axios.post("https://localhost:7230/api/vouchers/journal", data);
  return response;
};



export const getJournalVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/journal",

  );
  
  return response.data;
}

export const getSupplierPaymentVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/supplier-payment",

  );
  
  return response.data;
}


export const getCheques = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/Product/Cheque",

  );
  
  return response.data;
}

export const getPaymentVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/payment",

  );
  
  return response.data;
}

export const getCustomerReceiptVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/customer-receipt",

  );
  
  return response.data;
}

export const getContraVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/contra",

  );
  
  return response.data;
}
export const getPurchaseNonStockVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/purchase-non-stock",

  );
  
  return response.data;
}
export const getSalesNonStockVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/sales-non-stock",

  );
  
  return response.data;
}
export const getReceiptVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/vouchers/receipt",

  );
  
  return response.data;
}


export const getTrialBalance = async (date) => {
  const response = await axios.get(
    `https://localhost:7230/api/vouchers/trial-balance?asOfDate=${date}`,

  );
  
  return response.data;
}


export const getBalanceSheet = async (date) => {
  const response = await axios.get(
    `https://localhost:7230/api/vouchers/balance-sheet?asOfDate=${date}`,

  );
  
  return response.data;
}

export const getVouchers = async () => {
  const response = await axios.get(
    "https://localhost:7230/api/VatMaster",

  );
  
  return response.data;
}