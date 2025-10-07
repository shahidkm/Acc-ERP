    import { useMutation,useQuery } from "@tanstack/react-query";
   import { createLocation,getLocations } from "../../services/locationServices/locationServices";

    export const useCreateLocation=()=>{
        return useMutation({
            mutationFn:createLocation
        })
    }
    
export const useGetLocations= () => {
  return useQuery({
    queryKey: ["getLocations"],
    queryFn: getLocations,
  });
};