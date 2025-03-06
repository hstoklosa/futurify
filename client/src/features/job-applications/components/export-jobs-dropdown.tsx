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
    });

  const { refetch: refetchJson, isFetching: isJsonFetching } = useExportJobsToJson({
    boardId,
  });

  const handleExportExcel = async () => {
    const { data } = await refetchExcel();
    if (data) {
      downloadExcelFile(data, `job_applications_board_${boardId}.xlsx`);
    }
  };

  const handleExportJson = async () => {
    const { data } = await refetchJson();
    if (data) {
      downloadJsonFile(data, `job_applications_board_${boardId}.json`);
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
          onClick={handleExportExcel}
          disabled={isExcelFetching}
        >
          <FaFileExcel className="mr-2 h-4 w-4 text-green-600" />
          <span>Export to Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportJson}
          disabled={isJsonFetching}
        >
          <FaFileCode className="mr-2 h-4 w-4 text-blue-600" />
          <span>Export to JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
