    import { useMutation,useQuery } from "@tanstack/react-query";
    import { createDepartment,getDepartments } from "../../services/departmentServices/departmentServices";
    export const useCreateDepartment=()=>{
        return useMutation({
            mutationFn:createDepartment
        })
    }
    
export const useGetDepartments= () => {
  return useQuery({
    queryKey: ["getDepartments"],
    queryFn: getDepartments,
  });
};