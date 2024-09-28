export const applicationQueryKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationQueryKeys.all, "list"] as const,
  list: (filters: string) => [...applicationQueryKeys.lists(), { filters }] as const,
  details: () => [...applicationQueryKeys.all, "details"] as const,
  detail: (id: number) => [...applicationQueryKeys.details(), id] as const,
};
