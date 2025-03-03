// Query keys for job-related queries
export const jobQueryKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobQueryKeys.all, "list"] as const,
  list: (filters: string) => [...jobQueryKeys.lists(), { filters }] as const,
  listsByStage: () => [...jobQueryKeys.all, "listByStage"] as const,
  listByStage: (stageId: string) =>
    [...jobQueryKeys.listsByStage(), { stageId }] as const,
  details: () => [...jobQueryKeys.all, "details"] as const,
  detail: (id: number) => [...jobQueryKeys.details(), id] as const,
};
