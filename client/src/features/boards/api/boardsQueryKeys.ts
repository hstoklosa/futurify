export const boardsQueryKeys = {
  all: ["boards"] as const,
  lists: () => [...boardsQueryKeys.all, "list"] as const,
  list: (filters: string) => [...boardsQueryKeys.lists(), { filters }] as const,
  details: () => [...boardsQueryKeys.all, "details"] as const,
  detail: (id: string | number) => [...boardsQueryKeys.details(), id] as const,
  stages: (id: number) => [...boardsQueryKeys.detail(id), "stages"] as const,
};
