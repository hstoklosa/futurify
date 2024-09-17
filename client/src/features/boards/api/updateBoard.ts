import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MutationConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { Board } from "@/types/api";

import { getArchivedBoardsQueryOptions } from "./getArchivedBoards";
import { getActiveBoardsQueryOptions } from "./getActiveBoards";

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
      // Change board state to archived
      // Active list -> Archived list
      if ("archived" in variables.data && variables.data.archived) {
        queryClient.setQueryData(
          getArchivedBoardsQueryOptions().queryKey,
          (prev) => ({ data: [...prev!.data, data.data] })
        );

        queryClient.setQueryData(getActiveBoardsQueryOptions().queryKey, (prev) => ({
          data: prev!.data.filter((board) => board.id !== data.data.id),
        }));
      }

      // Restore board to active state
      // Archived list -> Active list
      if ("archived" in variables.data && !variables.data.archived) {
        queryClient.setQueryData(getActiveBoardsQueryOptions().queryKey, (prev) => ({
          data: [data.data, ...prev!.data],
        }));

        queryClient.setQueryData(
          getArchivedBoardsQueryOptions().queryKey,
          (prev) => ({
            data: prev!.data.filter((board) => board.id !== data.data.id),
          })
        );
      }

      onSuccess && onSuccess(data, variables, ...args);
    },
    ...rest,
    mutationFn: archiveBoard,
  });
};
