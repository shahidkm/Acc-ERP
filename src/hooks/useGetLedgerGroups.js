import { useQuery } from "@tanstack/react-query";
import { fetchLedgerGroups } from "../services/inventoryServices/fetchLedgerGroups";


export const useGetLedgerGroups= () => {
  return useQuery({
    queryKey: ["getLedgerGroups"],
    queryFn: fetchLedgerGroups,
  });
};
