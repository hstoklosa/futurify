import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Board } from "@/types/api";

import { boardsQueryKeys } from "./boardsQueryKeys";

const getBoard = async (id: string): Promise<{ data: Board }> => {
  return api.get(`/boards/${id}`);
};

export const getBoardQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: boardsQueryKeys.detail(id),
    queryFn: () => getBoard(id),
    meta: {
      showToast: true,
      toastMessage: "Failed to load board details. Please try again.",
    },
  });
};

type UseBoardOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getBoardQueryOptions>;
};

export const useBoard = ({ id, queryConfig }: UseBoardOptions) => {
  return useQuery({
    ...getBoardQueryOptions(id),
    ...queryConfig,
  });
};
