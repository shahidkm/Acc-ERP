import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../services/productServices/fetchProductsById";


export const useGetProductById = (id) => {
  return useQuery({
    queryKey: ["getProductById"],
    queryFn:()=> fetchProductById(id),
  });
};
