import { useQuery } from "@tanstack/react-query";
import { fetchCustomerGroupMembers } from "../../services/customerServices/fetchCustomerGroupMembers";


export const useGetCustomerGroupMembers= () => {
  return useQuery({
    queryKey: ["getCustomerGroupMembers"],
    queryFn: fetchCustomerGroupMembers,
  });
};
