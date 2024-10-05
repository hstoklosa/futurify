import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { Job } from "@/types/api";

import { jobQueryKeys } from "./job-query-keys";
import { createJobInput } from "@schemas/job-application";

type CreateJobFnData = {
  boardId: number;
  data: Omit<createJobInput, "boardId">;
};

const createJob = async ({
  boardId,
  data,
}: CreateJobFnData): Promise<{ data: Job }> => {
  return api.post(`/boards/${boardId}/jobs`, data);
};

export const useCreateJob = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof createJob>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data, ...args) => {
      const responseJob = data.data;
      queryClient.setQueryData(jobQueryKeys.detail(responseJob.id), responseJob);
      console.log(responseJob);
      onSuccess && onSuccess(data, ...args);
    },
    ...rest,
    mutationFn: createJob,
  });
};
