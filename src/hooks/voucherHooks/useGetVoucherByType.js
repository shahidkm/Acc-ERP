import { useQuery } from "@tanstack/react-query";
import { fetchVoucherByType } from "../../services/voucherServices/getVoucherByType";


export const useGetVoucherByType= (type) => {
  return useQuery({
    queryKey: ["getVouchers"],
    queryFn:()=>fetchVoucherByType(type),
  });
};
