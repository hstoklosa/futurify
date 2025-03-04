import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@lib/react-query";
import { api } from "@lib/api-client";

import { BoardInput } from "@/types/board";
import { getActiveBoardsQueryOptions } from "./getActiveBoards";

export const createBoard = async (data: BoardInput): Promise<{ data: number }> => {
  return api.post("/boards", data);
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
    meta: {
      showToast: true,
      toastMessage: "Failed to create board. Please try again.",
    },
    ...rest,
    mutationFn: createBoard,
  });
};
