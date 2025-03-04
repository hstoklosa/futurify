export const notesKeys = {
  all: ["notes"] as const,
  lists: () => [...notesKeys.all, "list"] as const,
  list: (filters: { jobId: number }) => [...notesKeys.lists(), filters] as const,
  details: () => [...notesKeys.all, "detail"] as const,
  detail: (id: number) => [...notesKeys.details(), id] as const,
};
