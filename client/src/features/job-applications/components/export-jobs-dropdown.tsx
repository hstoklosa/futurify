import React from "react";
import { LuDownload } from "react-icons/lu";
import { FaFileExcel, FaFileCode } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown";

import {
  useExportJobsToExcel,
  useExportJobsToJson,
  downloadExcelFile,
  downloadJsonFile,
} from "../api/export";

interface ExportJobsDropdownProps {
  boardId: string;
  className?: string;
  buttonVariant?: "default" | "outline" | "ghost";
  buttonSize?: "default" | "sm" | "md";
  label?: string;
}

export const ExportJobsDropdown: React.FC<ExportJobsDropdownProps> = ({
  boardId,
  className = "",
  buttonVariant = "outline",
  buttonSize = "default",
  label = "Export",
}) => {
  const { refetch: refetchExcel, isFetching: isExcelFetching } =
    useExportJobsToExcel({
      boardId,
      queryConfig: {
        retry: false,
      },
    });

  const { refetch: refetchJson, isFetching: isJsonFetching } = useExportJobsToJson({
    boardId,
    queryConfig: {
      retry: false,
    },
  });

  const handleExportExcel = async () => {
    try {
      console.log("Starting Excel export for board:", boardId);

      const result = await refetchExcel();

      if (result.error) {
        console.error("Excel export error:", result.error);
        return;
      }

      if (!result.data) {
        console.error("No data returned from Excel export");
        return;
      }

      console.log("Excel export successful, file size:", result.data.size);
      downloadExcelFile(result.data, `job_applications_board_${boardId}.xlsx`);
    } catch (err) {
      console.error("Excel export error:", err);
    }
  };

  const handleExportJson = async () => {
    try {
      console.log("Starting JSON export for board:", boardId);

      const result = await refetchJson();

      if (result.error) {
        console.error("JSON export error:", result.error);
        return;
      }

      if (!result.data) {
        console.error("No data returned from JSON export");
        return;
      }

      console.log("JSON export successful, file size:", result.data.size);
      downloadJsonFile(result.data, `job_applications_board_${boardId}.json`);
    } catch (err) {
      console.error("JSON export error:", err);
    }
  };

  const isLoading = isExcelFetching || isJsonFetching;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={className}
          disabled={isLoading}
        >
          <LuDownload className="mr-2 h-4 w-4" />
          {label}
          {isLoading && <span className="ml-2">...</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center"
          onClick={handleExportExcel}
          disabled={isExcelFetching}
        >
          <FaFileExcel className="mr-2 h-4 w-4 text-green-600" />
          <span>Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center"
          onClick={handleExportJson}
          disabled={isJsonFetching}
        >
          <FaFileCode className="mr-2 h-4 w-4 text-blue-600" />
          <span>JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
