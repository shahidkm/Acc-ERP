    import { useMutation,useQuery } from "@tanstack/react-query";
    import { createPurchaseInvoice,getPurchaseInvoices,getPurchaseInvoiceById,getPurchaseReturnInvoiceById,createPurchaseReturnInvoice,getPurchaseReturnInvoices,createSalesInvoice,getSalesInvoices } from "../../services/invoiceServices/invoiceService";

    export const useCreatePurchaseInvoice=()=>{
        return useMutation({
            mutationFn:createPurchaseInvoice
        })
    }

        export const useCreateSalesInvoice=()=>{
        return useMutation({
            mutationFn:createSalesInvoice
        })
    }
    
export const useGetPurchaseInvoices= () => {
  return useQuery({
    queryKey: ["getPurchaseInvoices"],
    queryFn: getPurchaseInvoices,
  });
};



export const useGetSalesInvoices= () => {
  return useQuery({
    queryKey: ["getSalesInvoices"],
    queryFn: getSalesInvoices,
  });
};
export const useGetPurchaseInvoiceById= (id) => {
  return useQuery({
    queryKey: ["getPurchaseInvoiceById"],
    queryFn:()=>getPurchaseInvoiceById(id),
  });
};

    export const useCreatePurchaseReturnInvoice=()=>{
        return useMutation({
            mutationFn:createPurchaseReturnInvoice
        })
    }
    
export const useGetPurchaseReturnInvoices= () => {
  return useQuery({
    queryKey: ["getPurchaseReturnInvoices"],
    queryFn: getPurchaseReturnInvoices,
  });
};

export const useGetPurchaseReturnInvoiceById= (id) => {
  return useQuery({
    queryKey: ["getPurchaseReturnInvoiceById"],
    queryFn:()=>getPurchaseReturnInvoiceById(id),
  });
};