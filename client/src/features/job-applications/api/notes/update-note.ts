import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";

import { NoteResponse } from "./types";
import { notesKeys } from "./notes-query-keys";

export type UpdateNoteDTO = {
  noteId: number;
  content: string;
  jobId: number; // needed for cache invalidation
};

/**
 * Update an existing note
 */
const updateNote = ({
  noteId,
  content,
}: Omit<UpdateNoteDTO, "jobId">): Promise<NoteResponse> => {
  return api.patch(`/notes/${noteId}`, { content });
};

/**
 * React query hook for updating a note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNote,
    onSuccess: (_, variables: UpdateNoteDTO) => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list({ jobId: variables.jobId }),
      });
    },
  });
};
