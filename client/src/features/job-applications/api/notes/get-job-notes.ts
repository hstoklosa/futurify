import { useQuery, queryOptions } from "@tanstack/react-query";

import { api } from "@lib/api-client";
import { QueryConfig } from "@lib/react-query";

import { Note } from "./types";
import { notesKeys } from "./notes-query-keys";

type GetJobNotesOptions = {
  jobId: number;
};

/**
 * Fetch notes for a specific job
 */
const getJobNotes = ({ jobId }: GetJobNotesOptions): Promise<Note[]> => {
  return api.get(`/notes/job/${jobId}`);
};

/**
 * Query options for fetching job notes
 */
export const getJobNotesOptions = (jobId: number) => {
  return queryOptions({
    queryKey: notesKeys.list({ jobId }),
    queryFn: () => getJobNotes({ jobId }),
  });
};

type UseGetJobNotesOptions = {
  jobId: number;
  queryConfig?: QueryConfig<typeof getJobNotesOptions>;
};

/**
 * React query hook for fetching job notes
 */
export const useGetJobNotes = ({ jobId, queryConfig }: UseGetJobNotesOptions) => {
  return useQuery({
    ...getJobNotesOptions(jobId),
    ...queryConfig,
  });
};
