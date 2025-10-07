    import { useMutation,useQuery } from "@tanstack/react-query";
   import { createArea,getAreas } from "../../services/areaServices/areaServices";

    export const useCreateArea=()=>{
        return useMutation({
            mutationFn:createArea
        })
    }
    
export const useGetAreas= () => {
  return useQuery({
    queryKey: ["getAreas"],
    queryFn: getAreas,
  });
};