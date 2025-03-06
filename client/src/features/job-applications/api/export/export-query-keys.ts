// Query keys for job export-related queries
export const exportQueryKeys = {
  all: ["jobExports"] as const,
  excel: () => [...exportQueryKeys.all, "excel"] as const,
  excelByBoard: (boardId: string) =>
    [...exportQueryKeys.excel(), { boardId }] as const,
  json: () => [...exportQueryKeys.all, "json"] as const,
  jsonByBoard: (boardId: string) =>
    [...exportQueryKeys.json(), { boardId }] as const,
};
