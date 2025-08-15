import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../services/productServices/fetchProducts";


export const useGetProducts = () => {
  return useQuery({
    queryKey: ["getProducts"],
    queryFn: fetchProducts,
  });
};
