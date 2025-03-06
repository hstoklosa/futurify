export const actionQueryKeys = {
  all: ["actions"] as const,
  lists: () => [...actionQueryKeys.all, "list"] as const,
  list: (jobId: number) => [...actionQueryKeys.lists(), { jobId }] as const,
  details: () => [...actionQueryKeys.all, "details"] as const,
  detail: (id: number) => [...actionQueryKeys.details(), id] as const,
};
