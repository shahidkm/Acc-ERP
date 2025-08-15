import { verifyOtp } from "../../services/authServices/verifyOtp";
import { useMutation } from "@tanstack/react-query";

export const useVerifyOtp=()=>{
    return useMutation({
        mutationFn:verifyOtp,
           onError: (error) => {
              const message = error?.response?.data;
        console.log(message);
            },
    })


}