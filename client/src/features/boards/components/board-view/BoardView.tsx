import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { Job } from "@/types/api";
import { useBoardStages } from "@features/boards/api/getBoardStages";
import { useJobs } from "@features/job-applications/api/get-jobs";
import { useUpdateJobPosition } from "@features/job-applications/api/update-job-position";

import BoardViewContainer from "./BoardViewContainer";
import BoardViewItem from "./BoardViewItem";
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
  // Use a minimal duration for responsive feeling
  duration: 120,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

const BoardView = ({ boardId }: BoardViewProps) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  // The activeDragInfo state is still useful for live drag visualization
  const [activeDragInfo, setActiveDragInfo] = useState<{
    jobId: number | null;
    fromStageId: number | null;
    toStageId: number | null;
    fromIndex: number | null;
    toIndex: number | null;
  }>({
    jobId: null,
    fromStageId: null,
    toStageId: null,
    fromIndex: null,
    toIndex: null,
  });

  const stagesQuery = useBoardStages({ id: boardId });
  const jobsQuery = useJobs({ boardId: boardId });
  const updateJobPosition = useUpdateJobPosition();

  const stages = stagesQuery.data!;
  const jobs = jobsQuery.data!;

  // Improved stageJobsMap calculation
  const stageJobsMap = useMemo(() => {
    const map = new Map<number, Job[]>();

    // Initialize empty arrays for each stage
    stages.data.forEach((stage) => map.set(stage.id, []));

    // Make a copy of jobs to avoid mutating original data
    const jobsCopy = [...jobs.data];

    // Group jobs by stage
    jobsCopy.forEach((job) => {
      const stageJobs = map.get(job.stageId) || [];
      stageJobs.push(job);
      map.set(job.stageId, stageJobs);
    });

    // Sort jobs within each stage by position
    map.forEach((stageJobs) => stageJobs.sort((a, b) => a.position - b.position));

    // Apply active drag adjustments for live sorting
    if (
      activeDragInfo.jobId &&
      activeDragInfo.fromStageId &&
      activeDragInfo.toStageId !== null
    ) {
      const draggedJob = jobs.data.find((job) => job.id === activeDragInfo.jobId);

      if (draggedJob) {
        // If dragging within the same stage
        if (
          activeDragInfo.fromStageId === activeDragInfo.toStageId &&
          activeDragInfo.fromIndex !== null &&
          activeDragInfo.toIndex !== null
        ) {
          const stageJobs = [...(map.get(activeDragInfo.fromStageId) || [])];

          // Remove the job from its original position
          const jobIndex = stageJobs.findIndex((job) => job.id === draggedJob.id);
          if (jobIndex !== -1) {
            stageJobs.splice(jobIndex, 1);

            // Insert the job at the new position
            const updatedJob = { ...draggedJob };
            stageJobs.splice(activeDragInfo.toIndex, 0, updatedJob);
            map.set(activeDragInfo.fromStageId, stageJobs);
          }
        }
        // If dragging between different stages
        else if (
          activeDragInfo.fromStageId !== activeDragInfo.toStageId &&
          activeDragInfo.toIndex !== null
        ) {
          // Remove from source stage
          const sourceStageJobs = [...(map.get(activeDragInfo.fromStageId) || [])];
          const jobIndex = sourceStageJobs.findIndex(
            (job) => job.id === draggedJob.id
          );

          if (jobIndex !== -1) {
            sourceStageJobs.splice(jobIndex, 1);
            map.set(activeDragInfo.fromStageId, sourceStageJobs);

            // Add to target stage
            const targetStageJobs = [...(map.get(activeDragInfo.toStageId) || [])];
            const updatedJob = { ...draggedJob, stageId: activeDragInfo.toStageId };
            targetStageJobs.splice(activeDragInfo.toIndex, 0, updatedJob);
            map.set(activeDragInfo.toStageId, targetStageJobs);
          }
        }
      }
    }

    return map;
  }, [jobs, stages, activeDragInfo]);

  const findBoardItem = (id: number): Job | undefined => {
    return jobs.data.find((job) => job.id === id);
  };

  const findPositionInStage = (stageId: number, jobId: number): number => {
    const stageJobs = stageJobsMap.get(stageId) || [];
    return stageJobs.findIndex((job) => job.id === jobId);
  };

  // Enhanced sensors for more responsive dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Reduced for better responsiveness
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as number;
    const job = findBoardItem(activeId);

    if (job) {
      setActiveJob(job);

      // Set initial drag info
      const stageId = job.stageId;
      const index = findPositionInStage(stageId, activeId);

      setActiveDragInfo({
        jobId: activeId,
        fromStageId: stageId,
        toStageId: stageId,
        fromIndex: index,
        toIndex: index,
      });
    }
  };

  // Improved onDragOver for more reliable drag behavior
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    // Don't do anything if hovering over the same item
    if (activeId === overId) return;

    // Get the active job and its stage
    const activeJob = findBoardItem(activeId);
    if (!activeJob) return;

    const activeStageId = activeDragInfo.fromStageId;
    if (!activeStageId) return;

    // Determine target stage and position
    let targetStageId: number;
    let targetIndex: number;

    // If over a container (stage)
    if (typeof overId === "string" || over.data.current?.type === "container") {
      // Get the stage by name
      const stageName = typeof overId === "string" ? overId : String(overId);
      const targetStage = stages.data.find((stage) => stage.name === stageName);

      if (!targetStage) return;

      targetStageId = targetStage.id;
      // Place at the end of the stage
      targetIndex = (stageJobsMap.get(targetStageId) || []).length;
    }
    // If over another item
    else {
      const overJobId = over.id as number;
      const overJob = findBoardItem(overJobId);

      if (!overJob) return;

      targetStageId = overJob.stageId;
      targetIndex = findPositionInStage(targetStageId, overJobId);

      // If moving within the same stage and the target is after the source,
      // we need to adjust the index to account for the removal of the source item
      if (
        targetStageId === activeStageId &&
        activeDragInfo.fromIndex !== null &&
        targetIndex > activeDragInfo.fromIndex
      ) {
        targetIndex -= 1;
      }
    }

    // Update the activeDragInfo to reflect the current state
    setActiveDragInfo({
      ...activeDragInfo,
      toStageId: targetStageId,
      toIndex: targetIndex,
    });
  };

  // Improved onDragEnd for more reliable position updates
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Reset active drag info and job
    setActiveJob(null);

    if (!over) {
      setActiveDragInfo({
        jobId: null,
        fromStageId: null,
        toStageId: null,
        fromIndex: null,
        toIndex: null,
      });
      return;
    }

    const activeId = active.id as number;
    const activeJob = findBoardItem(activeId);

    if (!activeJob) {
      setActiveDragInfo({
        jobId: null,
        fromStageId: null,
        toStageId: null,
        fromIndex: null,
        toIndex: null,
      });
      return;
    }

    const { fromStageId, toStageId, fromIndex, toIndex } = activeDragInfo;

    // Reset drag info immediately to avoid UI flicker
    setActiveDragInfo({
      jobId: null,
      fromStageId: null,
      toStageId: null,
      fromIndex: null,
      toIndex: null,
    });

    // Ensure we have valid indices
    if (
      fromStageId === null ||
      toStageId === null ||
      fromIndex === null ||
      toIndex === null
    ) {
      return;
    }

    // If nothing changed, return
    if (fromStageId === toStageId && fromIndex === toIndex) {
      return;
    }

    // Get the stage jobs
    const targetStageJobs = stageJobsMap.get(toStageId) || [];

    // Calculate the new position
    let newPosition: number;

    // If it's at the beginning of the list
    if (toIndex === 0) {
      newPosition =
        targetStageJobs.length > 0 ? targetStageJobs[0].position / 2 : 1000;
    }
    // If it's at the end of the list
    else if (toIndex >= targetStageJobs.length) {
      newPosition =
        targetStageJobs.length > 0
          ? targetStageJobs[targetStageJobs.length - 1].position + 1000
          : 1000;
    }
    // If it's in the middle of the list
    else {
      const prevPos = targetStageJobs[toIndex - 1].position;
      const nextPos = targetStageJobs[toIndex].position;
      newPosition = (prevPos + nextPos) / 2;
    }

    // Update job position in the backend
    updateJobPosition.mutate({
      jobId: activeId,
      boardId: boardId,
      data: {
        stageId: toStageId,
        position: newPosition,
      },
    });
  };

  const renderOverlay = () => {
    if (!activeJob) return null;

    return (
      <DragOverlay dropAnimation={dropAnimation}>
        <BoardViewItem
          id={activeJob.id}
          title={activeJob.title}
          companyName={activeJob.companyName}
          type={activeJob.type}
          location={activeJob.location}
          createdAt={activeJob.createdAt}
          isDragOverlay={true}
        />
      </DragOverlay>
    );
  };

  return (
    <>
      {stages.data.length > 0 ? (
        <div className="px-4 py-2 flex flex-row space-x-4 h-[calc(100vh-64px)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            {stages.data.map((stage) => {
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
                  >
                    {stageJobs.map((job) => {
                      return (
                        <JobViewDialog
                          key={job.id}
                          jobId={job.id}
                          boardId={Number(boardId)}
                          title={job.title}
                          companyName={job.companyName}
                          createdAt={job.createdAt}
                        >
                          <BoardViewItem
                            key={job.id}
                            id={job.id}
                            title={job.title}
                            companyName={job.companyName}
                            type={job.type}
                            location={job.location}
                            createdAt={job.createdAt}
                          />
                        </JobViewDialog>
                      );
                    })}
                  </BoardViewContainer>
                </SortableContext>
              );
            })}

            {renderOverlay()}
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
