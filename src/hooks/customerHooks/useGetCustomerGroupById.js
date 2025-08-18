import { useQuery } from "@tanstack/react-query";
import { fetchCustomerGroupById } from "../../services/customerServices/fetchCustomerGroupById";

export const useGetCustomerGroupById= (id) => {
  return useQuery({
    queryKey: ["getCustomerGroup"],
    queryFn:()=> fetchCustomerGroupById(id),
  });
};
