import { userLogin } from "../../services/authServices/userLogin";
import { useMutation } from "@tanstack/react-query";

export const useUserLogin=()=>{
    return useMutation({
        mutationFn:userLogin,
           onError: (error) => {
              const message = error?.response?.data;
        console.log(message);
            },
    })


}