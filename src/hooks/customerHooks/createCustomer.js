    import { useMutation } from "@tanstack/react-query";
    import { createCustomer } from "../../services/customerServices/createCustomer";

    export const useCreateCustomer=()=>{
        return useMutation({
            mutationFn:createCustomer
        })
    }