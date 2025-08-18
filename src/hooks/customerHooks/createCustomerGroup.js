import { useMutation } from "@tanstack/react-query";
import { createCustomerGroup } from "../../services/customerServices/createCustomerGroup";

export const useCreateCustomerGroup=()=>{
    return useMutation({
        mutationFn:createCustomerGroup
    })
}