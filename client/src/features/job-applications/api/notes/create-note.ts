import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@lib/api-client";

import { CreateNoteDTO, NoteResponse } from "./types";
import { notesKeys } from "./notes-query-keys";

/**
 * Create a new note for a job
 */
const createNote = (data: CreateNoteDTO): Promise<NoteResponse> => {
  return api.post("/notes", data);
};

/**
 * React query hook for creating a note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.list({ jobId: variables.jobId }),
      });
    },
  });
};
