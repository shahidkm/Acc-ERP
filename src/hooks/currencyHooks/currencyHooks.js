    import { useMutation,useQuery } from "@tanstack/react-query";
   import { createCurrency,getCurrencies } from "../../services/currencyServices/currencyServices";

    export const useCreateCurrency=()=>{
        return useMutation({
            mutationFn:createCurrency
        })
    }
    
export const useGetCurrencies= () => {
  return useQuery({
    queryKey: ["getCurrencies"],
    queryFn: getCurrencies,
  });
};