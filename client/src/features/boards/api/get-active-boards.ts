import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";
import { BoardList } from "@/types/api";

import { boardsQueryKeys } from "./boards-query-keys";

export const getActiveBoards = async (): Promise<{ data: BoardList }> => {
  return api.get("/boards?archived=false&sort=DESC");
};

export const getActiveBoardsQueryOptions = () => {
  return queryOptions({
    queryKey: boardsQueryKeys.list("active"),
    queryFn: getActiveBoards,
    meta: {
      showToast: true,
      toastMessage: "Failed to load active boards. Please try again.",
    },
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

/* REF: https://tkdodo.eu/blog/react-query-data-transformations [select-partial-subscriptions]

type UseActiveBoardsOptions<TResult> = {
  queryConfig?: QueryConfig<typeof getActiveBoardsQueryOptions>;
  select: (_data: { data: BoardList }) => TResult;
};

export const useActiveBoards = <TResult>({
  queryConfig,
  select,
}: UseActiveBoardsOptions<TResult>) => {
  return useQuery({
    ...getActiveBoardsQueryOptions(),
    ...queryConfig,
    select,
  });
};

export const useActiveBoard = (id: number) => {
  return useQuery({
    ...getActiveBoardsQueryOptions(),
    select: ({ data }) => ({ data: data.find((board) => board.id === id) }),
  });
};

*/
