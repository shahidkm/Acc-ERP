import { useQuery } from "@tanstack/react-query";
import { getInventoryCategories,getInventorySubCategories,getInventoryUnits,getInventoryItemMasters } from "../../services/inventoryServices/getInventoryCategories";


export const useGetInventoryCategories= () => {
  return useQuery({
    queryKey: ["getInventoryCategories"],
    queryFn: getInventoryCategories,
  });
};


export const useGetInventorySubCategories= () => {
  return useQuery({
    queryKey: ["getInventorySubCategories"],
    queryFn: getInventorySubCategories,
  });
};




export const useGetInventoryUnits= () => {
  return useQuery({
    queryKey: ["getInventoryUnits"],
    queryFn: getInventoryUnits,
  });
};

export const useGetInventoryItemMasters= () => {
  return useQuery({
    queryKey: ["getInventoryItemMasters"],
    queryFn: getInventoryItemMasters,
  });
};