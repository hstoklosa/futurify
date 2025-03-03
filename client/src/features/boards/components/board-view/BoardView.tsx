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
  closestCorners,
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
  // Use a minimal duration to avoid the "return to original position" effect
  duration: 150,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

// IDEA: The componenets used in this code can be nicely
//       implemented as reusable components within lib/dnd-kit.tsx.
const BoardView = ({ boardId }: BoardViewProps) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  // Add state to track optimistic updates
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    jobId: number;
    stageId: number;
    position: number;
  } | null>(null);
  // Add state to track active dragging for live sorting
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

  const stageJobsMap = useMemo(() => {
    const map = new Map<number, Job[]>();

    // Initialize empty arrays for each stage
    stages.data.forEach((stage) => map.set(stage.id, []));

    // Copy the original jobs
    const jobsCopy = [...jobs.data];

    // Group jobs by stage
    jobsCopy.forEach((job) => {
      // Skip jobs that are being actively dragged - they'll be added with the active drag info
      if (activeDragInfo.jobId === job.id) {
        return;
      }

      // Apply optimistic updates if applicable
      if (optimisticUpdates && optimisticUpdates.jobId === job.id) {
        const updatedJob = {
          ...job,
          stageId: optimisticUpdates.stageId,
          position: optimisticUpdates.position,
        };
        const stageJobs = map.get(updatedJob.stageId) || [];
        stageJobs.push(updatedJob);
        map.set(updatedJob.stageId, stageJobs);
      } else {
        const stageJobs = map.get(job.stageId) || [];
        stageJobs.push(job);
        map.set(job.stageId, stageJobs);
      }
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

          // Remove the job from its original position if it's not already handled by optimisticUpdates
          if (!optimisticUpdates || optimisticUpdates.jobId !== draggedJob.id) {
            const jobIndex = stageJobs.findIndex((job) => job.id === draggedJob.id);
            if (jobIndex !== -1) {
              stageJobs.splice(jobIndex, 1);
            }

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
          // Only handle if not already covered by optimistic updates
          if (!optimisticUpdates || optimisticUpdates.jobId !== draggedJob.id) {
            // Remove from source stage
            const sourceStageJobs = [
              ...(map.get(activeDragInfo.fromStageId) || []),
            ];
            const jobIndex = sourceStageJobs.findIndex(
              (job) => job.id === draggedJob.id
            );
            if (jobIndex !== -1) {
              sourceStageJobs.splice(jobIndex, 1);
              map.set(activeDragInfo.fromStageId, sourceStageJobs);
            }

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
  }, [jobs, stages, optimisticUpdates, activeDragInfo]);

  const findBoardItem = (id: number): Job | undefined => {
    return jobs.data.find((job) => job.id === id);
  };

  const findPositionInStage = (stageId: number, jobId: number): number => {
    const stageJobs = stageJobsMap.get(stageId) || [];
    return stageJobs.findIndex((job) => job.id === jobId);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // Slightly reduced for better responsiveness
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

    logEvent("DragStart", event);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    // Don't do anything if hovering over the same item
    if (activeId === overId) return;

    // Get the active job's stage
    const activeStageId = activeDragInfo.fromStageId;

    // Determine target stage and position
    let targetStageId: number;
    let targetIndex: number;

    // If over a container (stage)
    if (typeof overId === "string" || over.data.current?.type === "container") {
      // Try to find the stage by name or id
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
    }

    // Update active drag info for live sorting
    if (
      activeStageId !== null &&
      (targetStageId !== activeDragInfo.toStageId ||
        targetIndex !== activeDragInfo.toIndex)
    ) {
      setActiveDragInfo({
        ...activeDragInfo,
        toStageId: targetStageId,
        toIndex: targetIndex,
      });
    }

    logEvent("DragOver", event);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      // Reset states if not dropped over a valid target
      setActiveJob(null);
      setActiveDragInfo({
        jobId: null,
        fromStageId: null,
        toStageId: null,
        fromIndex: null,
        toIndex: null,
      });
      return;
    }

    const activeJobId = active.id as number;
    const activeJob = findBoardItem(activeJobId);

    if (!activeJob) {
      // Reset states if active job not found
      setActiveJob(null);
      setActiveDragInfo({
        jobId: null,
        fromStageId: null,
        toStageId: null,
        fromIndex: null,
        toIndex: null,
      });
      return;
    }

    // Get the stage ID from the over container
    let targetStageId: number;
    let newPosition: number;

    // If dropping over a container (stage)
    if (typeof over.id === "string" || over.data.current?.type === "container") {
      // Find the stage ID by name
      const stageName = typeof over.id === "string" ? over.id : String(over.id);
      const targetStage = stages.data.find((stage) => stage.name === stageName);

      if (!targetStage) {
        // Reset states if target stage not found
        setActiveJob(null);
        setActiveDragInfo({
          jobId: null,
          fromStageId: null,
          toStageId: null,
          fromIndex: null,
          toIndex: null,
        });
        return;
      }

      targetStageId = targetStage.id;
      // Place at the end of the stage
      newPosition = (stageJobsMap.get(targetStageId) || []).length;
    }
    // If dropping over another item
    else {
      const overJobId = over.id as number;
      const overJob = findBoardItem(overJobId);

      if (!overJob) {
        // Reset states if over job not found
        setActiveJob(null);
        setActiveDragInfo({
          jobId: null,
          fromStageId: null,
          toStageId: null,
          fromIndex: null,
          toIndex: null,
        });
        return;
      }

      targetStageId = overJob.stageId;
      // Get position of the job being dropped on
      newPosition = findPositionInStage(targetStageId, overJobId);
    }

    // Store whether an update is needed before resetting states
    const shouldUpdate =
      activeJob.stageId !== targetStageId || activeJob.position !== newPosition;

    // Apply optimistic update if needed (only if position actually changes)
    if (shouldUpdate) {
      // First set the optimistic update
      setOptimisticUpdates({
        jobId: activeJobId,
        stageId: targetStageId,
        position: newPosition,
      });

      // Then send update to backend
      updateJobPosition.mutate(
        {
          jobId: activeJobId,
          data: {
            stageId: targetStageId,
            position: newPosition,
          },
          boardId: boardId,
        },
        {
          // Clear optimistic update once the mutation is complete
          onSettled: () => {
            setOptimisticUpdates(null);
          },
        }
      );
    }

    // Now reset the active drag states
    setActiveJob(null);
    setActiveDragInfo({
      jobId: null,
      fromStageId: null,
      toStageId: null,
      fromIndex: null,
      toIndex: null,
    });

    logEvent("DragEnd", event);
  };

  const renderOverlay = () => {
    if (!activeJob) return null;

    return (
      <BoardViewItem
        id={activeJob.id}
        title={activeJob.title}
        companyName={activeJob.companyName}
        location={activeJob.location}
        type={activeJob.type}
        createdAt={activeJob.createdAt}
        isDragOverlay={true}
      />
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="h-full w-max flex px-1 pt-[1rem] mt-[55px] mx-4 space-x-5 overflow-y-auto">
        {stages.data.map((stage) => (
          <SortableContext
            key={stage.id}
            items={stageJobsMap.get(stage.id)!.map((job) => job.id)}
            strategy={verticalListSortingStrategy}
          >
            <BoardViewContainer
              boardId={boardId}
              id={stage.id}
              items={stageJobsMap.get(stage.id)!.map((job) => job.id)}
              name={stage.name}
            >
              {stageJobsMap.get(stage.id)!.map((job) => (
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
                    location={job.location}
                    type={job.type}
                    createdAt={job.createdAt}
                  />
                </JobViewDialog>
              ))}
            </BoardViewContainer>
          </SortableContext>
        ))}

        <DragOverlay dropAnimation={dropAnimation}>{renderOverlay()}</DragOverlay>
      </div>
    </DndContext>
  );
};

const logEvent = (
  name: string,
  event: DragStartEvent | DragEndEvent | DragOverEvent
) => {
  console.log(`${name}:`, event);
};

export default BoardView;
