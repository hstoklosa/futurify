import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { Board } from "@/types/api";

import { getArchivedBoardsQueryOptions } from "./get-archived-boards";
import { getActiveBoardsQueryOptions } from "./get-active-boards";

type ArchiveBoardData = {
  data: {
    name?: string;
    archived?: boolean;
  };
  boardId: string;
};

export const archiveBoard = ({
  data,
  boardId,
}: ArchiveBoardData): Promise<{ data: Board }> => {
  return api.patch(`/boards/${boardId}`, data);
};

export const useUpdateBoard = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof archiveBoard>) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      if ("archived" in variables.data && variables.data.archived) {
        queryClient.setQueryData(
          getArchivedBoardsQueryOptions().queryKey,
          (prev) => ({ data: [...(prev?.data || []), data.data] })
        );

        queryClient.setQueryData(
          getActiveBoardsQueryOptions().queryKey,
          (prev) => ({
            data: prev
              ? prev.data.filter((board) => board.id !== data.data.id)
              : [],
          })
        );
      }

      if ("archived" in variables.data && !variables.data.archived) {
        queryClient.setQueryData(
          getActiveBoardsQueryOptions().queryKey,
          (prev) => ({
            data: [data.data, ...(prev?.data || [])],
          })
        );

        queryClient.setQueryData(
          getArchivedBoardsQueryOptions().queryKey,
          (prev) => ({
            data: prev
              ? prev.data.filter((board) => board.id !== data.data.id)
              : [],
          })
        );
      }

      onSuccess && onSuccess(data, variables, ...args);
    },
    meta: {
      showToast: true,
      toastMessage: "Failed to update board. Please try again.",
    },
    ...rest,
    mutationFn: archiveBoard,
  });
};
