        import { useMutation,useQuery } from "@tanstack/react-query";
       import { createCountry,getCountries } from "../../services/countryServices/countryServices";
    
        export const useCreateCountry=()=>{
            return useMutation({
                mutationFn:createCountry
            })
        }
        
    export const useGetCountries= () => {
      return useQuery({
        queryKey: ["getCountries"],
        queryFn: getCountries,
      });
    };