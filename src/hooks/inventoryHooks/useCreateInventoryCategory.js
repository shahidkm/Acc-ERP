    import { useMutation } from "@tanstack/react-query";
    import { createCategory,createSubCategory,createUnit } from "../../services/inventoryServices/createCategory";

    export const useCreateInventoryCategory=()=>{
        return useMutation({
            mutationFn:createCategory
        })
    }

      export const useCreateInventorSubCategory=()=>{
        return useMutation({
            mutationFn:createSubCategory
        })
    }

      export const useCreateInventoryUnit=()=>{
        return useMutation({
            mutationFn:createUnit
        })
    }