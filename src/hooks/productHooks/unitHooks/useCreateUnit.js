import { useMutation } from "@tanstack/react-query";
import { createUnit } from "../../../services/productServices/unitServices/createUnit";


export const useCreateUnit= () => {
  return useMutation({
    mutationFn: createUnit,
    onError: (error) => {
    //   const message = error?.response?.data;
     
      console.error("Registration Error:", error);
    },
  });
};
