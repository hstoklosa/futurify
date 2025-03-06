import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { exportQueryKeys } from "./export-query-keys";

/**
 * Function to export jobs to JSON format
 * @param boardId - The ID of the board containing the jobs
 * @returns A Promise that resolves to a Blob containing the JSON file
 */
const exportJobsToJson = async (boardId: string): Promise<Blob> => {
  // Use axios with responseType: "blob" to get binary data
  const response = await api.request({
    url: `/jobs/export/json/board/${boardId}`,
    method: "GET",
    responseType: "blob",
    headers: {
      Accept: "application/json",
    },
    // Override the default response interceptor to get the raw response
    transformResponse: [(data) => data],
  });

  return new Blob([response.data]);
};

/**
 * Query options for exporting jobs to JSON
 */
export const exportJobsToJsonOptions = (boardId: string) => {
  return queryOptions({
    queryKey: exportQueryKeys.jsonByBoard(boardId),
    queryFn: () => exportJobsToJson(boardId),
    enabled: false, // This query will not run automatically
    meta: {
      showToast: true,
      toastMessage: "Failed to export job applications to JSON. Please try again.",
    },
  });
};

/**
 * Options for the useExportJobsToJson hook
 */
type UseExportJobsToJsonOptions = {
  boardId: string;
  queryConfig?: QueryConfig<typeof exportJobsToJsonOptions>;
};

/**
 * Hook for exporting jobs to JSON
 */
export const useExportJobsToJson = ({
  boardId,
  queryConfig,
}: UseExportJobsToJsonOptions) => {
  return useQuery({
    ...exportJobsToJsonOptions(boardId),
    ...queryConfig,
  });
};

/**
 * Helper function to trigger the JSON download
 */
export const downloadJsonFile = (
  blob: Blob,
  filename = "job_applications.json"
) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
