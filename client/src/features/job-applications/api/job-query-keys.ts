export const jobQueryKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobQueryKeys.all, "list"] as const,
  list: (filters: string) => [...jobQueryKeys.lists(), { filters }] as const,
  details: () => [...jobQueryKeys.all, "details"] as const,
  detail: (id: number) => [...jobQueryKeys.details(), id] as const,
};
