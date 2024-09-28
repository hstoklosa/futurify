import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";
import { Stage } from "@/types/api";

import { stageQueryKeys } from "./queryKeys";

const getBoardStages = async (id: string): Promise<{ data: Stage[] }> => {
  return api.get(`/boards/${id}/stages`);
};

export const getBoardStagesOptions = (id: string) => {
  return queryOptions({
    queryKey: stageQueryKeys.list(id),
    queryFn: () => getBoardStages(id),
  });
};

type UseBoardStagesOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getBoardStagesOptions>;
};

export const useBoardStages = ({ id, queryConfig }: UseBoardStagesOptions) => {
  return useSuspenseQuery({
    ...getBoardStagesOptions(id),
    ...queryConfig,
  });
};