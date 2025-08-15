import {userRegister} from "../../services/authServices/userRegister"
import { useMutation } from "@tanstack/react-query";


export const useUserRegister = () => {
  return useMutation({
    mutationFn: userRegister,
    onError: (error) => {
    //   const message = error?.response?.data;
     
      console.error("Registration Error:", error);
    },
  });
};
