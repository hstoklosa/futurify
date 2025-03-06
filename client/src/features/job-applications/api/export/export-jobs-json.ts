import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { exportQueryKeys } from "./export-query-keys";
import axios from "axios";

/**
 * Function to export jobs to JSON format
 * @param boardId - The ID of the board containing the jobs
 * @returns A Promise that resolves to a Blob containing the JSON file
 */
const exportJobsToJson = async (boardId: string): Promise<Blob> => {
  try {
    // Use axios directly to ensure proper blob handling
    const response = await axios({
      url: `${api.defaults.baseURL}/jobs/export/json/board/${boardId}`,
      method: "GET",
      responseType: "blob",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      withCredentials: true,
    });

    // Return the response data as a blob with the correct MIME type
    return new Blob([response.data], {
      type: "application/json",
    });
  } catch (error) {
    console.error("Error exporting JSON:", error);
    throw error;
  }
};

/**
 * Query options for exporting jobs to JSON
 */
export const exportJobsToJsonOptions = (boardId: string) => {
  return queryOptions({
    queryKey: exportQueryKeys.jsonByBoard(boardId),
    queryFn: () => exportJobsToJson(boardId),
    enabled: false, // This query will not run automatically
    gcTime: 0, // Don't cache this query
    retry: 1, // Only retry once if fails
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
  filename = `job_applications_board.json`
) => {
  // No need to re-create the blob as it should already have the correct MIME type
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
