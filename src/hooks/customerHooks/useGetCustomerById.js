import { useQuery } from "@tanstack/react-query";
import { fetchCustomerById } from "../../services/customerServices/fetchCustomerById";


export const useGetCustomerById= () => {
  return useQuery({
    queryKey: ["getCustomer"],
    queryFn: fetchCustomerById,
  });
};
