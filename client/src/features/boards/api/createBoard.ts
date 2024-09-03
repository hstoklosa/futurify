import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { Response } from "@/types/api";
import { BoardInput } from "@/types/board";

import { getActiveBoardsQueryOptions } from "./getActiveBoards";

export const createBoard = async (data: BoardInput): Promise<Response<number>> => {
  const response = await api.post("/boards", data);
  return response.data;
};

export const useCreateBoard = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof createBoard>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getActiveBoardsQueryOptions().queryKey,
      });
      onSuccess && onSuccess(...args);
    },
    ...rest,
    mutationFn: createBoard,
  });
};
