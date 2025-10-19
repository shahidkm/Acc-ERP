import { useQuery } from "@tanstack/react-query";
import { fetchCustomers,fetchCustomerAccountMasters,fetchSupplierAccountMasters} from "../../services/customerServices/fetchCustomers";


export const useGetCustomers= () => {
  return useQuery({
    queryKey: ["getCustomers"],
    queryFn: fetchCustomers,
  });
};


export const useGetCustomerAccountMasters= () => {
  return useQuery({
    queryKey: ["getCustomerAccountMaster"],
    queryFn: fetchCustomerAccountMasters,
  });
};

export const useGetSupplierAccountMasters= () => {
  return useQuery({
    queryKey: ["fetchSupplierAccountMasters"],
    queryFn: fetchSupplierAccountMasters,
  });
};
