import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";
import { BoardList } from "@/types/api";

import { boardsQueryKeys } from "./boardsQueryKeys";

export const getArchivedBoards = async (): Promise<{ data: BoardList }> => {
  return api.get("/boards?archived=true&sort=ASC");
};

export const getArchivedBoardsQueryOptions = () => {
  return queryOptions({
    queryKey: boardsQueryKeys.list("archived"),
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
