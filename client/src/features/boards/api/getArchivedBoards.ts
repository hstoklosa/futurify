import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";
import { BoardListResponse } from "@/types/api";

export const getArchivedBoards = async (): Promise<BoardListResponse> => {
  return api.get("/boards?archived=true&sort=ASC");
};

export const getArchivedBoardsQueryOptions = () => {
  return queryOptions({
    queryKey: ["boards", { archived: true }],
    queryFn: getArchivedBoards,
  });
};

type UseArchivedBoardsOptions = {
  queryConfig?: QueryConfig<typeof getArchivedBoardsQueryOptions>;
};

export const useArchivedBoards = ({ queryConfig }: UseArchivedBoardsOptions) => {
  return useQuery({
    ...getArchivedBoardsQueryOptions(),
    ...queryConfig,
  });
};
