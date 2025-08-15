
import { useMutation } from "@tanstack/react-query";
import { createCategory } from "../../../services/productServices/categoryServices/createCategory";


export const useCreateProductWarehouse= () => {
  return useMutation({
    mutationFn: createCategory,
    onError: (error) => {
    //   const message = error?.response?.data;
     
      console.error("Registration Error:", error);
    },
  });
};
