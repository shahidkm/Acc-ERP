import { useQuery } from "@tanstack/react-query";
import { fetchAllVouchers } from "../../services/voucherServices/getAllVouchers";


export const useGetAllVouchers= () => {
  return useQuery({
    queryKey: ["getAllVouchers"],
    queryFn: fetchAllVouchers,
  });
};
