    import { useMutation,useQuery } from "@tanstack/react-query";
   import { createBank,getBanks } from "../../services/bankServices/bankServices";

    export const useCreateBank=()=>{
        return useMutation({
            mutationFn:createBank
        })
    }
    
export const useGetBanks= () => {
  return useQuery({
    queryKey: ["getBanks"],
    queryFn: getBanks,
  });
};