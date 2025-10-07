import { useQuery } from "@tanstack/react-query";
import { fetchLedgers } from "../services/inventoryServices/fetchLedgers";


export const useGetLedgers= () => {
  return useQuery({
    queryKey: ["getLedgers"],
    queryFn: fetchLedgers,
  });
};
