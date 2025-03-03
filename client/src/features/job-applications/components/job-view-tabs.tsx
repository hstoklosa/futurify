import React, { useState } from "react";
import { LuPencil } from "react-icons/lu";

import { Spinner } from "@components/ui/spinner";
import { Button } from "@components/ui/button";
import { cn } from "@utils/cn";

import { useBoardStages } from "@features/boards/api/getBoardStages";
import { useGetJob } from "../api/get-job";
import UpdateJobForm from "./update-job-form";

type TabContentProps = {
  jobId: number;
  boardId: number;
};

export const ApplicationTab = ({ jobId, boardId }: TabContentProps) => {
  const [editingMode, setEditingMode] = useState(false);

  const { data: job, isPending: jobPending } = useGetJob({ jobId: jobId });
  const { data: stages, isPending: stagesPending } = useBoardStages({
    id: String(boardId),
  });

  if (jobPending || stagesPending)
    <Spinner
      size="lg"
      className="h-96"
    />;

  if (!job || !stages) return <div />;

  const enableEditing = () => setEditingMode(true);
  const disableEditing = () => setEditingMode(false);
  return (
    <div className="flex h-full">
      {editingMode && (
        <UpdateJobForm
          currentJob={job!.data}
          currentStages={stages.data}
          onSuccess={() => {
            console.log("success");
            disableEditing();
          }}
          onCancel={disableEditing}
        />
      )}

      {!editingMode && (
        <>
          <div className="h-full w-[50%] border-r-[1px] border-border px-5 mt-6">
            <JobViewTabHeader className="flex items-start justify-between">
              <span className="mr-2">Application Details</span>
              <Button
                variant="outlineMuted"
                size="sm"
                className="flex items-center justify-center justify-self-end h-6 px-2 py-1"
                onClick={enableEditing}
              >
                <span>Edit</span>
                <LuPencil className="stroke-foreground/50 ml-1 size-[11px]" />
              </Button>
            </JobViewTabHeader>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Job Title</span>
                <span className="text-base">{job.data.title}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Company</span>
                <span className="text-base">{job.data.companyName}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-base">{job.data.location}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Job Type</span>
                <span className="text-base">{job.data.type}</span>
              </div>

              {job.data.salary && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Salary</span>
                  <span className="text-base">{job.data.salary}</span>
                </div>
              )}

              {job.data.postUrl && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Job Post URL
                  </span>
                  <a
                    href={job.data.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-primary hover:underline"
                  >
                    View Original Post
                  </a>
                </div>
              )}

              {job.data.description && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <span className="text-base whitespace-pre-wrap">
                    {job.data.description}
                  </span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Created At</span>
                <span className="text-base">
                  {new Date(job.data.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-base">
                  {new Date(job.data.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 mt-3 w-[50%]">
            <JobViewTabHeader className="text-[15px]">Timeline</JobViewTabHeader>
          </div>
        </>
      )}
    </div>
  );
};

export const AiTab = ({ jobId, boardId }: TabContentProps) => {
  return (
    <div className="text-base font-semibold text-secondary ">
      AI Powered Insights
    </div>
  );
};

export const InterviewsTab = ({ jobId, boardId }: TabContentProps) => {
  return <div>Interviews</div>;
};

export const NotesTab = ({ jobId, boardId }: TabContentProps) => {
  return <span>Notes</span>;
};

const JobViewTabHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("text-base font-semibold text-secondary mb-3", className)}>
    {children}
  </div>
);
