import { useMutation } from "@tanstack/react-query";
import { createCompany } from "../../services/companyServices/createCompany";

export const useCreateCompany=()=>{
    return useMutation({
        mutationFn:createCompany
    })
}