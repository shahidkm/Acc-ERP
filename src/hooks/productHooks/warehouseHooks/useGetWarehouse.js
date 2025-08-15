import { useQuery } from "@tanstack/react-query";
import { fetchWarehouse } from "../../../services/productServices/warehouseServices/fetchWarehouse";

export const useGetWarehouses = () => {
  return useQuery({
    queryKey: ["getWarehouses"],
    queryFn: fetchWarehouse,
  });
};
