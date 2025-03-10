import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";

import { Job } from "@/types/api";
import { useBoardStages } from "@/features/boards/api/get-board-stages";
import { useJobs } from "@features/job-applications/api/get-jobs";
import { useUpdateJobPosition } from "@features/job-applications/api/update-job-position";
import { jobQueryKeys } from "@features/job-applications/api/job-query-keys";

import BoardViewContainer from "./board-view-container";
import BoardViewItem from "./board-view-item";
import JobViewDialog from "@/features/job-applications/components/job-view-dialog";

type BoardViewProps = {
  boardId: string;
  children?: React.ReactNode;
};

// Custom drop animation for smoother transitions
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
  duration: 150,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

// Helper function to find a job by id in the jobs array
const findJobById = (jobs: Job[], id: number): Job | undefined => {
  return jobs.find((job) => job.id === id);
};

// Calculate a new position between two values
const calculatePosition = (prevPosition: number, nextPosition: number): number => {
  // If positions are too close, create more space
  if (Math.abs(nextPosition - prevPosition) < 100) {
    return nextPosition + 1000;
  }

  // Default: place in the middle with slight preference toward the next position
  return prevPosition + (nextPosition - prevPosition) / 2;
};

const BoardView = ({ boardId }: BoardViewProps) => {
  const queryClient = useQueryClient();

  // State to track the active job being dragged
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  // State to track which stage the active job is currently over
  const [activeStageId, setActiveStageId] = useState<number | null>(null);
  // State to track where the dragged item would be dropped (creating space)
  const [activeDropTarget, setActiveDropTarget] = useState<{
    stageId: number;
    index: number;
  } | null>(null);

  // Fetch stages and jobs data
  const stagesQuery = useBoardStages({ id: boardId });
  const jobsQuery = useJobs({ boardId: boardId });
  const updateJobPosition = useUpdateJobPosition();

  // Unwrap data
  const stages = stagesQuery.data!;
  const jobs = jobsQuery.data!;

  // Create a map of jobs by stage, for rendering and optimistic updates
  const stageJobsMap = useMemo(() => {
    const map = new Map<number, Job[]>();

    // Initialize empty arrays for each stage
    stages.data.forEach((stage) => {
      map.set(stage.id, []);
    });

    // Group jobs by stage
    jobs.data.forEach((job) => {
      const stageJobs = map.get(job.stageId) || [];
      stageJobs.push(job);
      map.set(job.stageId, stageJobs);
    });

    // Sort jobs within each stage by position
    map.forEach((stageJobs) => {
      stageJobs.sort((a, b) => a.position - b.position);
    });

    return map;
  }, [jobs, stages]);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const jobId = active.id as number;
    const job = findJobById(jobs.data, jobId);

    if (job) {
      setActiveJob(job);
      setActiveStageId(job.stageId);
    }
  };

  // Handle drag over - detect when item moves between stages and set active drop target
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const activeJobId = active.id as number;
    const activeJob = findJobById(jobs.data, activeJobId);

    if (!activeJob) return;

    // Get the current active stage ID
    const sourceStageId = activeJob.stageId;

    // Determine target stage ID and drop index
    let targetStageId: number;
    let dropIndex: number;

    // If hovering over a container directly
    if (typeof over.id === "string") {
      // Find the stage by name (container id is the stage name)
      const targetStage = stages.data.find((stage) => stage.name === over.id);

      if (targetStage) {
        targetStageId = targetStage.id;
        // If dropping into an empty stage or at the end of a stage
        const stageJobs = stageJobsMap.get(targetStageId) || [];
        dropIndex = stageJobs.length;

        // Update the active stage ID and drop target
        setActiveStageId(targetStageId);
        setActiveDropTarget({ stageId: targetStageId, index: dropIndex });
      }
      return;
    }

    // If hovering over another job item
    const overId = over.id as number;
    const overJob = findJobById(jobs.data, overId);

    if (!overJob) return;

    targetStageId = overJob.stageId;

    // Get jobs in the target stage
    const targetJobs = stageJobsMap.get(targetStageId) || [];
    dropIndex = targetJobs.findIndex((job) => job.id === overId);

    // If the active job is in the same stage and before the over job,
    // we need to adjust the dropIndex to account for the item being removed
    if (sourceStageId === targetStageId) {
      const activeIndex = targetJobs.findIndex((job) => job.id === activeJobId);
      if (activeIndex !== -1 && activeIndex < dropIndex) {
        dropIndex -= 1;
      }
    }

    // Update the active stage ID and drop target
    setActiveStageId(targetStageId);
    setActiveDropTarget({ stageId: targetStageId, index: dropIndex + 1 }); // +1 to drop after the item
  };

  // Handle drag end - update job positions
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset drag state
    setActiveJob(null);
    setActiveStageId(null);
    setActiveDropTarget(null);

    // If no valid drop target, do nothing
    if (!over) return;

    const activeJobId = active.id as number;
    const activeJob = findJobById(jobs.data, activeJobId);

    if (!activeJob) return;

    // Get the current stage ID of the active job
    const sourceStageId = activeJob.stageId;

    // Determine target stage ID
    let targetStageId: number;
    let overJobId: number | null = null;

    // If dropping over a container (stage)
    if (typeof over.id === "string") {
      const targetStage = stages.data.find((stage) => stage.name === over.id);
      if (!targetStage) return;

      targetStageId = targetStage.id;
    }
    // If dropping over an item
    else {
      overJobId = over.id as number;
      const overJob = findJobById(jobs.data, overJobId);
      if (!overJob) return;

      targetStageId = overJob.stageId;
    }

    // Get all jobs in source and target stages
    const sourceJobs = [...(stageJobsMap.get(sourceStageId) || [])];
    const targetJobs = [...(stageJobsMap.get(targetStageId) || [])];

    // If source and target are the same stage
    if (sourceStageId === targetStageId) {
      // Find the indices of the active and over jobs
      const activeIndex = sourceJobs.findIndex((job) => job.id === activeJobId);

      // If dropping on a container, place at the end
      if (typeof over.id === "string") {
        // Create a new position that's greater than all existing positions
        const newPosition =
          targetJobs.length > 0
            ? targetJobs[targetJobs.length - 1].position + 1000
            : 1000;

        // Perform optimistic update
        performOptimisticUpdate(activeJobId, targetStageId, newPosition);

        // Update position in backend
        updateJobPosition.mutate({
          jobId: activeJobId,
          boardId,
          data: {
            stageId: targetStageId,
            position: newPosition,
          },
        });

        return;
      }

      const overIndex = sourceJobs.findIndex((job) => job.id === overJobId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        // Create a new array with the moved item
        const newJobs = arrayMove(sourceJobs, activeIndex, overIndex);

        // Calculate new position based on surrounding items
        let newPosition: number;

        // If moving to the beginning
        if (overIndex === 0) {
          newPosition = newJobs[1] ? newJobs[0].position / 2 : 1000;
        }
        // If moving to the end
        else if (overIndex === sourceJobs.length - 1) {
          newPosition = newJobs[overIndex - 1].position + 1000;
        }
        // If moving between items
        else {
          // Get the positions of the items before and after
          const prevPosition = overIndex > 0 ? newJobs[overIndex - 1].position : 0;
          const nextPosition =
            overIndex < newJobs.length - 1
              ? newJobs[overIndex + 1].position
              : prevPosition + 2000;

          // Calculate a position between them
          newPosition = calculatePosition(prevPosition, nextPosition);
        }

        // Perform optimistic update
        performOptimisticUpdate(activeJobId, targetStageId, newPosition);

        // Update position in backend
        updateJobPosition.mutate({
          jobId: activeJobId,
          boardId,
          data: {
            stageId: targetStageId,
            position: newPosition,
          },
        });
      }
    }
    // If moving between different stages
    else {
      let newPosition: number;

      // If dropping directly on a stage (at the end)
      if (typeof over.id === "string") {
        // Place at the end of the target stage
        newPosition =
          targetJobs.length > 0
            ? targetJobs[targetJobs.length - 1].position + 1000
            : 1000;
      }
      // If dropping on an item in a different stage
      else {
        const overIndex = targetJobs.findIndex((job) => job.id === overJobId);

        // If dropping at the beginning of the list
        if (overIndex === 0) {
          newPosition = targetJobs.length > 0 ? targetJobs[0].position / 2 : 1000;
        }
        // If dropping at the end of the list
        else if (overIndex === targetJobs.length - 1) {
          newPosition = targetJobs[overIndex].position + 1000;
        }
        // If dropping between items
        else {
          const prevPosition = targetJobs[overIndex - 1].position;
          const overPosition = targetJobs[overIndex].position;

          // Calculate a position between them
          newPosition = calculatePosition(prevPosition, overPosition);
        }
      }

      // Perform optimistic update
      performOptimisticUpdate(activeJobId, targetStageId, newPosition);

      // Update stage and position in backend
      updateJobPosition.mutate({
        jobId: activeJobId,
        boardId,
        data: {
          stageId: targetStageId,
          position: newPosition,
        },
      });
    }
  };

  // Helper function to perform optimistic updates
  const performOptimisticUpdate = (
    jobId: number,
    newStageId: number,
    newPosition: number
  ) => {
    // Get the current jobs data from the cache
    const currentJobs = queryClient.getQueryData<{ data: Job[] }>(
      jobQueryKeys.list(boardId)
    );

    if (!currentJobs) return;

    // Find the job to update
    const jobToUpdate = currentJobs.data.find((job) => job.id === jobId);
    if (!jobToUpdate) return;

    // Create a deep copy of the jobs array
    const updatedJobs = currentJobs.data.filter((job) => job.id !== jobId);

    // Create an updated job with the new position and stage
    const updatedJob = {
      ...jobToUpdate,
      stageId: newStageId,
      position: newPosition,
    };

    // Add the updated job to the array
    updatedJobs.push(updatedJob);

    // Sort the jobs by position within each stage
    updatedJobs.sort((a, b) => {
      if (a.stageId !== b.stageId) {
        return a.stageId - b.stageId;
      }
      return a.position - b.position;
    });

    // Update the cache with our optimistic result
    queryClient.setQueryData(jobQueryKeys.list(boardId), { data: updatedJobs });
  };

  // Function to determine if an item is the active drop target for creating space
  const isDropTarget = (stageId: number, index: number) => {
    return (
      activeDropTarget !== null &&
      activeDropTarget.stageId === stageId &&
      activeDropTarget.index === index
    );
  };

  return (
    <>
      {stages.data.length > 0 ? (
        <div className="flex flex-row h-full">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {stages.data.map((stage) => {
              // Get jobs for this stage, potentially modified for optimistic UI updates
              const stageJobs = stageJobsMap.get(stage.id) || [];
              const stageJobIds = stageJobs.map((job) => job.id);

              return (
                <SortableContext
                  key={stage.id}
                  items={stageJobIds}
                  strategy={verticalListSortingStrategy}
                >
                  <BoardViewContainer
                    boardId={boardId}
                    id={stage.id}
                    name={stage.name}
                    items={stageJobIds}
                    isActiveStage={activeStageId === stage.id}
                  >
                    {/* Add a drop indicator if we're dragging and this is the first position */}
                    {activeJob && isDropTarget(stage.id, 0) && (
                      <div className="h-[4px] bg-primary rounded my-2 mx-1 transition-all duration-200" />
                    )}

                    {stageJobs.map((job, index) => (
                      <React.Fragment key={job.id}>
                        <JobViewDialog
                          jobId={job.id}
                          boardId={Number(boardId)}
                          title={job.title}
                          companyName={job.companyName}
                          createdAt={job.createdAt}
                        >
                          <BoardViewItem
                            id={job.id}
                            title={job.title}
                            companyName={job.companyName}
                            type={job.type}
                            location={job.location}
                            createdAt={job.createdAt}
                            postUrl={job.postUrl}
                          />
                        </JobViewDialog>

                        {/* Add a drop indicator if we're dragging and this position should have a gap */}
                        {activeJob && isDropTarget(stage.id, index + 1) && (
                          <div className="h-[4px] bg-primary rounded my-2 mx-1 transition-all duration-200" />
                        )}
                      </React.Fragment>
                    ))}
                  </BoardViewContainer>
                </SortableContext>
              );
            })}

            {/* Drag overlay for visual feedback during dragging */}
            {activeJob && (
              <DragOverlay dropAnimation={dropAnimation}>
                <BoardViewItem
                  id={activeJob.id}
                  title={activeJob.title}
                  companyName={activeJob.companyName}
                  type={activeJob.type}
                  location={activeJob.location}
                  createdAt={activeJob.createdAt}
                  postUrl={activeJob.postUrl}
                  isDragOverlay={true}
                />
              </DragOverlay>
            )}
          </DndContext>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl text-foreground">
            No stages found for this board
          </h2>
          <p className="text-foreground-muted">
            Please create stages for this board to start adding job applications
          </p>
        </div>
      )}
    </>
  );
};

export default BoardView;
