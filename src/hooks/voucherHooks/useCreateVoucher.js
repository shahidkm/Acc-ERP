import { useMutation } from "@tanstack/react-query";
import { createVoucher } from "../../services/voucherServices/createVoucher";

export const useCreateVoucher = () => {
    return useMutation({
        mutationFn: createVoucher
    });
};
