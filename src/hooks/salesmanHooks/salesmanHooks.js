    import { useMutation,useQuery } from "@tanstack/react-query";
   import { getSalesmans,createSalesman } from "../../services/salesmanServices/salesmanServices";
    export const useCreateSalesMan=()=>{
        return useMutation({
            mutationFn:createSalesman
        })
    }
    
export const useGetSalesmans= () => {
  return useQuery({
    queryKey: ["getSalesmans"],
    queryFn: getSalesmans,
  });
};