import { useQuery } from "@tanstack/react-query";
import { fetchCustomerGroups } from "../../services/customerServices/fetchCustomerGroups";


export const useGetCustomerGroups= () => {
  return useQuery({
    queryKey: ["getCustomerGroups"],
    queryFn: fetchCustomerGroups,
  });
};
