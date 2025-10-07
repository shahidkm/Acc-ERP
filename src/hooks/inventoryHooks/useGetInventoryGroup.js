import { useQuery } from "@tanstack/react-query";
import { getInventoryGroups } from "../../services/inventoryServices/getInventoryGroup";


export const useGetInventoryGroups= () => {
  return useQuery({
    queryKey: ["getInventoryGroups"],
    queryFn: getInventoryGroups,
  });
};
