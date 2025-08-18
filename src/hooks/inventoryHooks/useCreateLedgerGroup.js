    import { useMutation } from "@tanstack/react-query";
    import { createLedgerGroup } from "../../services/inventoryServices/createLedgerGroup";

    export const useCreateLedgerGroup=()=>{
        return useMutation({
            mutationFn:createLedgerGroup
        })
    }