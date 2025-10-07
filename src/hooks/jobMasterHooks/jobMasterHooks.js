    import { useMutation,useQuery } from "@tanstack/react-query";
    import { createJobMaster,getJobMasters } from "../../services/jobMasterServices/jobMasterService";

    export const useCreateJobMaster=()=>{
        return useMutation({
            mutationFn:createJobMaster
        })
    }
    
export const useGetJobMasters= () => {
  return useQuery({
    queryKey: ["getJobMasters"],
    queryFn: getJobMasters,
  });
};