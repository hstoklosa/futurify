export const stageQueryKeys = {
  all: ["stages"] as const,
  lists: () => [...stageQueryKeys.all, "list"] as const,
  list: (filters: string) => [...stageQueryKeys.lists(), { filters }] as const,
  details: () => [...stageQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...stageQueryKeys.details(), id] as const,
};
