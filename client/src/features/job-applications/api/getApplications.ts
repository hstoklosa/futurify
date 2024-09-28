import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
// import { QueryConfig } from "@lib/react-query";

import { Application } from "@/types/api";
import { applicationQueryKeys } from "./applicationQueryKeys";

export const getApplications = async (
  boardId: string
): Promise<{ data: Application[] }> => {
  return api.get(`/applications/${boardId}`);
};

export const getApplicationsOptions = (boardId: string) => {
  return queryOptions({
    queryKey: applicationQueryKeys.list(boardId),
    queryFn: () => getApplications(boardId),
  });
};

// type UseApplicationsOptions = {
//   boardId: string;
//   queryConfig?: QueryConfig<typeof getApplicationsOptions>;
// };

// export const useApplications = ({
//   boardId,
//   queryConfig,
// }: UseApplicationsOptions) => {
//   return useQuery({
//     ...getApplicationsOptions(boardId),
//     ...queryConfig,
//   });
// };

type UseApplicationsOptions = {
  id?: string;
  select?: (application: Application) => boolean;
};

type UseJobApplicationsReturn = { data: { data: Application[] } };

export const useJobApplications = ({
  id,
  select = () => true,
}: UseApplicationsOptions): UseJobApplicationsReturn => {
  const applications = [
    { id: 1, stageId: 1, title: "Job 1", company: "Facebook" },
    { id: 2, stageId: 1, title: "Job 2", company: "Apple" },
    { id: 3, stageId: 1, title: "Job 3", company: "Facebook" },
    { id: 4, stageId: 1, title: "Job 4", company: "Facebook" },
    { id: 5, stageId: 2, title: "Job 5", company: "Amazon" },
    { id: 6, stageId: 2, title: "Job 6", company: "StoneX" },
    { id: 7, stageId: 3, title: "Job 7", company: "Netflix" },
    { id: 8, stageId: 4, title: "Job 8", company: "Netflix" },
  ];

  const filteredApplications = applications.filter(select);

  return {
    data: {
      data: filteredApplications,
    },
  };
};
