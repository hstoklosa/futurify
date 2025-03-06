import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@lib/react-query";
import { api } from "@lib/api-client";
import { exportQueryKeys } from "./export-query-keys";

/**
 * Function to export jobs to Excel format
 * @param boardId - The ID of the board containing the jobs
 * @returns A Promise that resolves to a Blob containing the Excel file
 */
const exportJobsToExcel = async (boardId: string): Promise<Blob> => {
  // Use axios with responseType: "blob" to get binary data
  const response = await api.request({
    url: `/jobs/export/excel/board/${boardId}`,
    method: "GET",
    responseType: "blob",
    headers: {
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    // Override the default response interceptor to get the raw response
    transformResponse: [(data) => data],
  });

  return new Blob([response.data]);
};

/**
 * Query options for exporting jobs to Excel
 */
export const exportJobsToExcelOptions = (boardId: string) => {
  return queryOptions({
    queryKey: exportQueryKeys.excelByBoard(boardId),
    queryFn: () => exportJobsToExcel(boardId),
    enabled: false, // This query will not run automatically
    meta: {
      showToast: true,
      toastMessage: "Failed to export job applications to Excel. Please try again.",
    },
  });
};

/**
 * Options for the useExportJobsToExcel hook
 */
type UseExportJobsToExcelOptions = {
  boardId: string;
  queryConfig?: QueryConfig<typeof exportJobsToExcelOptions>;
};

/**
 * Hook for exporting jobs to Excel
 */
export const useExportJobsToExcel = ({
  boardId,
  queryConfig,
}: UseExportJobsToExcelOptions) => {
  return useQuery({
    ...exportJobsToExcelOptions(boardId),
    ...queryConfig,
  });
};

/**
 * Helper function to trigger the Excel download
 */
export const downloadExcelFile = (
  blob: Blob,
  filename = "job_applications.xlsx"
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
