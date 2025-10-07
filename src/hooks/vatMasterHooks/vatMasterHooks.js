        import { useMutation,useQuery } from "@tanstack/react-query";
       import { createVatMaster,getVatMasters } from "../../services/vatMasterServices/vatMasterServices";
    
        export const useCreateVatMaster=()=>{
            return useMutation({
                mutationFn:createVatMaster
            })
        }
        
    export const useGetVatMasters= () => {
      return useQuery({
        queryKey: ["getVatMasters"],
        queryFn: getVatMasters,
      });
    };