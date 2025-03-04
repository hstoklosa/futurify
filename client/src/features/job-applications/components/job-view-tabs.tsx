import React, { useState } from "react";
import { LuPencil } from "react-icons/lu";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useBoardStages } from "@/features/boards/api/getBoardStages";
import { useGetJob } from "../api/get-job";
import UpdateJobForm from "./update-job-form";
import { JobTimeline } from "./job-timeline";
import { JobInsights } from "./job-insights";
import { CreateNote } from "./notes/create-note";
import { NoteList } from "./notes/note-list";
import { useGetJobNotes } from "../api/notes";

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
          onSuccess={() => disableEditing()}
          onCancel={disableEditing}
        />
      )}

      {!editingMode && (
        <>
          <div className="w-[60%] border-r-[1px] border-border flex flex-col">
            <div className="flex items-start justify-between px-5">
              <JobViewTabHeader>Application Details</JobViewTabHeader>
              <Button
                variant="outlineMuted"
                size="sm"
                className="flex items-center justify-center justify-self-end h-6 px-2 py-1"
                onClick={enableEditing}
              >
                <span>Edit</span>
                <LuPencil className="stroke-foreground/50 ml-1 size-[11px]" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col space-y-4 px-5 pb-6">
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
                    <span className="text-sm text-muted-foreground">
                      Description
                    </span>
                    <span className="text-base whitespace-pre-wrap break-words">
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
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-base">
                    {new Date(job.data.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </ScrollArea>
          </div>
          <div className="w-[40%] px-5">
            <JobViewTabHeader className="text-[16px] mb-4">
              Timeline
            </JobViewTabHeader>
            <JobTimeline jobId={jobId} />
          </div>
        </>
      )}
    </div>
  );
};

export const AiTab = ({ jobId }: { jobId: number }) => {
  return (
    <div className="flex h-full">
      <div className="w-full flex flex-col">
        {/* <div className="flex items-start justify-between px-5 pt-2">
          <JobViewTabHeader>AI Insights</JobViewTabHeader>
        </div> */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col space-y-4 px-5 pb-6">
            <JobInsights jobId={jobId} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export const InterviewsTab = () => {
  return (
    <div className="flex h-full">
      <div className="w-full flex flex-col">
        <div className="flex items-start justify-between px-5">
          <JobViewTabHeader>Interviews</JobViewTabHeader>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col space-y-4 px-5 pb-6">
            {/* Interview content will go here */}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export const NotesTab = ({ jobId }: { jobId: number }) => {
  const { data: notes, isPending } = useGetJobNotes({ jobId });

  return (
    <div className="flex h-full">
      <div className="w-full flex flex-col">
        <div className="flex items-start justify-between px-5 py-2">
          <JobViewTabHeader>Notes</JobViewTabHeader>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col space-y-6 px-5 py-4">
            <CreateNote jobId={jobId} />
            {isPending ? (
              <Spinner size="lg" />
            ) : (
              <NoteList
                notes={notes || []}
                jobId={jobId}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
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
