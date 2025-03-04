import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api-client";
import { notesKeys } from "./notes-query-keys";

type DeleteNoteOptions = {
  noteId: number;
  _jobId: number;
};

/**
 * Delete a note by ID
 */
const deleteNote = ({ noteId, _jobId }: DeleteNoteOptions): Promise<void> => {
  return api.delete(`/notes/${noteId}`);
};

/**
 * React query hook for deleting a note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list({ jobId: variables._jobId }),
      });
    },
  });
};
