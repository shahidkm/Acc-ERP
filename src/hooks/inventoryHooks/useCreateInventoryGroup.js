    import { useMutation } from "@tanstack/react-query";
    import { createGroup,createPurchaseOrder,getGoodsReceiptNotes,getPurchaseOrders,createItemMaster,createQuotationRental,createQuotationSale,getQuotationSales,getQuotationRentals,getSalesOrders,createSalesOrder,createSubGroup } from "../../services/inventoryServices/createGroup";
import { useQuery } from "@tanstack/react-query";
    export const useCreateInventoryGroup=()=>{
        return useMutation({
            mutationFn:createGroup
        })
    }


  export const useCreateInventorySubGroup=()=>{
        return useMutation({
            mutationFn:createSubGroup
        })
    }




        export const useCreateItemMaster=()=>{
        return useMutation({
            mutationFn:createItemMaster
        })
    }

           export const useCreateQuotationSale=()=>{
        return useMutation({
            mutationFn:createQuotationSale
        })
    }

               export const useCreateQuotationRental=()=>{
        return useMutation({
            mutationFn:createQuotationRental
        })
    }

    export const useGetQuotationSales= () => {
      return useQuery({
        queryKey: ["getQuotationSales"],
        queryFn: getQuotationSales,
      });
    };

    export const useGetGoodsReceiptNotes= () => {
      return useQuery({
        queryKey: ["getGoodsReceiptNotes"],
        queryFn: getGoodsReceiptNotes,
      });
    };

        export const useGetQuotationRentals= () => {
      return useQuery({
        queryKey: ["getQuotationRentals"],
        queryFn: getQuotationRentals,
      });
    };


            export const useCreateSalesOrder=()=>{
        return useMutation({
            mutationFn:createSalesOrder
        })
    }


                export const useCreatePurchaseOrder=()=>{
        return useMutation({
            mutationFn:getPurchaseOrders
        })
    }


               export const useGetPurchaseOrders=()=>{
        return useMutation({
            mutationFn:createPurchaseOrder
        })
    }


         export const useGetSalesOrders= () => {
      return useQuery({
        queryKey: ["getSalesOrders"],
        queryFn: getSalesOrders,
      });
    };

    
            export const useCreateDeliveryOrder=()=>{
        return useMutation({
            mutationFn:createSalesOrder
        })
    }