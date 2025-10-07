import { useQuery } from "@tanstack/react-query";
import { fetchVendors } from "../../services/vendorServices/fetchVendors";


export const useGetVendors= () => {
  return useQuery({
    queryKey: ["getVendors"],
    queryFn: fetchVendors,
  });
};
