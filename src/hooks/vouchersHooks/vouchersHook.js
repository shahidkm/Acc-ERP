        import { useMutation,useQuery } from "@tanstack/react-query";
       import { createVoucher,getVouchers,getCheques,createCheque,getBalanceSheet,getSupplierPaymentVouchers,getContraVouchers,getTrialBalance,getCustomerReceiptVouchers,createSalesNonStockVoucher,getSalesNonStockVouchers,getPurchaseNonStockVouchers,createPurchaseNonStockVoucher,createPaymentVoucher,getPaymentVouchers,getReceiptVouchers,getJournalVouchers,createJournalVoucher } from "../../services/vouchersServices/vouchersService";
    
        export const useCreateVoucher=()=>{
            return useMutation({
                mutationFn:createVoucher
            })
        }


           export const useCreateCheque=()=>{
            return useMutation({
                mutationFn:createCheque
            })
        }

   export const useCreatePaymentVoucher=()=>{
            return useMutation({
                mutationFn:createPaymentVoucher
            })
        }

           export const useCreatePurchaseNonStockVoucher=()=>{
            return useMutation({
                mutationFn:createPurchaseNonStockVoucher
            })
        }
      export const useCreateSalesNonStockVoucher=()=>{
            return useMutation({
                mutationFn:createSalesNonStockVoucher
            })
        }
                export const useCreateJournalVoucher=()=>{
            return useMutation({
                mutationFn:createJournalVoucher
            })
        }
    export const useGetVouchers= () => {
      return useQuery({
        queryKey: ["GetVouchers"],
        queryFn: GetVouchers,
      });
    };


       export const useGetCheques= () => {
      return useQuery({
        queryKey: ["getCheques"],
        queryFn: getCheques,
      });
    };

    export const useGetSupplierPaymentVouchers= () => {
      return useQuery({
        queryKey: ["getSupplierPaymentVouchers"],
        queryFn: getSupplierPaymentVouchers,
      });
    };

      export const useGetJournalVouchers= () => {
      return useQuery({
        queryKey: ["getJournalVouchers"],
        queryFn: getJournalVouchers,
      });
    };


     export const useGetPaymentVouchers= () => {
      return useQuery({
        queryKey: ["getPaymentVouchers"],
        queryFn: getPaymentVouchers,
      });
    };



     export const useGetCustomerReceiptVouchers= () => {
      return useQuery({
        queryKey: ["getCustomerReceiptVouchers"],
        queryFn: getCustomerReceiptVouchers,
      });
    };


      export const useGetContraVouchers= () => {
      return useQuery({
        queryKey: ["getContraVouchers"],
        queryFn: getContraVouchers,
      });
    };

        export const useGetPurchaseNonStockVouchers= () => {
      return useQuery({
        queryKey: ["getPurchaseNonStockVouchers"],
        queryFn: getPurchaseNonStockVouchers,
      });
    };
        export const useGetSalesNonStockVouchers= () => {
      return useQuery({
        queryKey: ["getSalesNonStockVouchers"],
        queryFn: getSalesNonStockVouchers,
      });
    };

         export const useGetReceiptVouchers= () => {
      return useQuery({
        queryKey: ["getReceiptVouchers"],
        queryFn: getReceiptVouchers,
      });
    };


           export const useGetTrialBalance= (date) => {
      return useQuery({
        queryKey: ["getTrialBalance"],
        queryFn:()=> getTrialBalance(date),
      });
    };

    
           export const useGetBalanceSheet= (date) => {
      return useQuery({
        queryKey: ["getTrialBalance"],
        queryFn:()=> getBalanceSheet(date),
      });
    };