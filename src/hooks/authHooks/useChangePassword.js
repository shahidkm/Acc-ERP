import { changePassword } from "../../services/authServices/changePassword";
import { useMutation } from "@tanstack/react-query";

export const useChangePassword=()=>{
    return useMutation({
        mutationFn:changePassword,
           onError: (error) => {
              const message = error?.response?.data;
        console.log(message);
            },
    })


}