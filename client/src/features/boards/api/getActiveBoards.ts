import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";
import { BoardListResponse } from "@/types/api";

export const getActiveBoards = async (): Promise<BoardListResponse> => {
  return api.get("/boards?archived=false&sort=DESC");
};

export const getActiveBoardsQueryOptions = () => {
  return queryOptions({
    queryKey: ["boards", { archived: false }],
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
