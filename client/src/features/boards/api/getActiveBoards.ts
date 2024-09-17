import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";
import { BoardList } from "@/types/api";

import { boardsQueryKeys } from "./boardsQueryKeys";

export const getActiveBoards = async (): Promise<{ data: BoardList }> => {
  return api.get("/boards?archived=false&sort=DESC");
};

export const getActiveBoardsQueryOptions = () => {
  return queryOptions({
    queryKey: boardsQueryKeys.list("active"),
    queryFn: getActiveBoards,
  });
};

type UseActiveBoardsOptions = {
  queryConfig?: QueryConfig<typeof getActiveBoardsQueryOptions>;
};

export const useActiveBoards = ({ queryConfig }: UseActiveBoardsOptions) => {
  return useQuery({
    ...getActiveBoardsQueryOptions(),
    ...queryConfig,
  });
};
