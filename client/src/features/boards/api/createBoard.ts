import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { api } from "@lib/api-client";

export const createBoard = async (data: { name: string }) => {
  const response = await api.post("/board", data);
  return response.data;
};

export const useCreateBoard = ({
  onSuccess,
  ...rest
}: MutationConfig<typeof createBoard>) => {
  return useMutation({
    onSuccess: (...args) => {
      onSuccess && onSuccess(...args);
    },
    ...rest,
    mutationFn: createBoard,
  });
};
