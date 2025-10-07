import { useQuery } from "@tanstack/react-query";
import { getSubGroup } from "../../services/inventoryServices/getSubGroup";


export const useGetInventorySubGroups= () => {
  return useQuery({
    queryKey: ["getInventorySubGroups"],
    queryFn: getSubGroup,
  });
};
