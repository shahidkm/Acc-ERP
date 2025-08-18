import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../../services/customerServices/fetchCustomers";


export const useGetCustomers= () => {
  return useQuery({
    queryKey: ["getCustomers"],
    queryFn: fetchCustomers,
  });
};
