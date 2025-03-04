import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJobInput } from "@schemas/job-application";
import { jobQueryKeys } from "./job-query-keys";

type UpdateJobData = {
  data: updateJobInput;
  jobId: number;
};

const updateJob = ({ jobId, data }: UpdateJobData) => {
  return api.put(`/jobs/${jobId}`, data);
};

export const useUpdateJob = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof updateJob>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: jobQueryKeys.detail(variables.jobId),
      });

      // Invalidate the stage list that contains this job
      if (data?.data?.data?.stageId) {
        queryClient.invalidateQueries({
          queryKey: jobQueryKeys.listByStage(String(data.data.data.stageId)),
        });
      }

      // Invalidate the board list that contains this job
      queryClient.invalidateQueries({
        queryKey: jobQueryKeys.lists(),
      });

      onSuccess && onSuccess(data, variables, context);
    },
    meta: {
      showToast: true,
      toastMessage: "Failed to update job application. Please try again.",
    },
    mutationFn: updateJob,
    ...rest,
  });
};
