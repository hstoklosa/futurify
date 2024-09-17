export const boardsQueryKeys = {
  all: ["boards"] as const,
  lists: () => [...boardsQueryKeys.all, "list"] as const,
  list: (filters: string) => [...boardsQueryKeys.lists(), { filters }] as const,
};
