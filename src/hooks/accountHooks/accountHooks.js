    import { useMutation,useQuery } from "@tanstack/react-query";
 import { createAccountCategory,getAccountCategories,createAccountGroup,getAccountGroups,createAccountMaster,getAccountMasters,getAccountEnquiries,getAddressList } from "../../services/accountServices/accountServices";

    export const useCreateAccountCategory=()=>{
        return useMutation({
            mutationFn:createAccountCategory
        })
    }

    export const useGetAccountCategories= () => {
  return useQuery({
    queryKey: ["getAccountCategories"],
    queryFn: getAccountCategories,
  });
};


    export const useCreateAccountGroup=()=>{
        return useMutation({
            mutationFn:createAccountGroup
        })
    }

    export const useGetAccountGroups= () => {
  return useQuery({
    queryKey: ["getAccountGroups"],
    queryFn: getAccountGroups,
  });
};


    export const useCreateAccountMaster=()=>{
        return useMutation({
            mutationFn:createAccountMaster
        })
    }

        export const useGetAccountMasters= () => {
  return useQuery({
    queryKey: ["getAccountMasters"],
    queryFn: getAccountMasters,
  });
};



        export const useGetAccountEnquries= () => {
  return useQuery({
    queryKey: ["getAccountEnquiries"],
    queryFn: getAccountEnquiries,
  });
};


export const useGetAddressList = (num) => {
  return useQuery({
    queryKey: ["getAddressList", num], // <-- include `num`
    queryFn: () => getAddressList(num),
    enabled: !!num, // optional: only run if `num` is truthy
  });
};
