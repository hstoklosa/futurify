import { api } from "@lib/api-client";
import { MutationConfig } from "@lib/react-query";
import { useMutation } from "@tanstack/react-query";

type UpdateJobData = {
  data: {
    name?: string;
    archived?: boolean;
  };
  jobId: string;
};

const updateJob = ({ jobId, data }: UpdateJobData) => {
  return api.put(`/jobs/${jobId}`, data);
};

export const useUpdateJob = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof updateJob>) => {
  return useMutation({
    onSuccess: (data, ...args) => {
      // ... data transformation/invalidation
      onSuccess && onSuccess(data, ...args);
    },
    mutationFn: updateJob,
    ...rest,
  });
};
