import { sendOtp } from "../../services/authServices/sendOtp";
import { useMutation } from "@tanstack/react-query";

export const useSendOtp=()=>{
    return useMutation({
        mutationFn:sendOtp,
           onError: (error) => {
              const message = error?.response?.data;
        console.log(message);
            },
    })


}