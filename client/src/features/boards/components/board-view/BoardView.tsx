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

// IDEA: The componenets used in this code can be nicely
//       implemented as reusable components within lib/dnd-kit.tsx.
const BoardView = ({ boardId }: BoardViewProps) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const stagesQuery = useBoardStages({ id: boardId });
  const jobsQuery = useJobs({ boardId: boardId });
  const updateJobPosition = useUpdateJobPosition();

  const stages = stagesQuery.data!;
  const jobs = jobsQuery.data!;

  const stageJobsMap = useMemo(() => {
    const map = new Map<number, Job[]>();

    const addToStage = (job: Job) => {
      let mapValue: ReturnType<typeof map.get>;
      if ((mapValue = map.get(job.stageId))) {
        mapValue.push(job);
      }
    };

    stages.data.forEach((stage) => map.set(stage.id, []));
    jobs.data.forEach((job) => addToStage(job));
    map.forEach((stageJobs) => stageJobs.sort((a, b) => a.position - b.position));

    return map;
  }, [jobs, stages]);

  const findBoardItem = (id: number): Job | undefined => {
    return jobs.data.find((job) => job.id === id);
  };

  const findPositionInStage = (stageId: number, jobId: number): number => {
    const stageJobs = stageJobsMap.get(stageId) || [];
    return stageJobs.findIndex((job) => job.id === jobId);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const job = findBoardItem(active.id as number);
    if (job) {
      setActiveJob(job);
    }

    logEvent("DragStart", event);
  };

  const onDragOver = (event: DragOverEvent) => {
    logEvent("DragOver", event);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveJob(null);

    if (!over) return;

    const activeJobId = active.id as number;
    const activeJob = findBoardItem(activeJobId);

    if (!activeJob) return;

    // Get the stage ID from the over container
    let targetStageId: number;
    let newPosition: number;

    // If dropping over a container (stage)
    if (over.data.current?.type === "container") {
      // Find the stage ID by name
      const targetStage = stages.data.find((stage) => stage.name === over.id);
      if (!targetStage) return;

      targetStageId = targetStage.id;
      // Place at the end of the stage
      newPosition = stageJobsMap.get(targetStageId)?.length || 0;
    }
    // If dropping over another item
    else {
      const overJobId = over.id as number;
      const overJob = findBoardItem(overJobId);

      if (!overJob) return;

      targetStageId = overJob.stageId;
      // Get position of the job being dropped on
      newPosition = findPositionInStage(targetStageId, overJobId);
    }

    // Only update if the job is moved to a different stage or position
    if (activeJob.stageId !== targetStageId || activeJob.position !== newPosition) {
      updateJobPosition.mutate({
        jobId: activeJobId,
        data: {
          stageId: targetStageId,
          position: newPosition,
        },
        boardId: boardId,
      });
    }

    logEvent("DragEnd", event);
  };

  const renderOverlay = () => {
    const selectedJob = activeJob;
    if (selectedJob)
      return (
        <BoardViewItem
          id={selectedJob.id}
          title={selectedJob.title}
          companyName={selectedJob.companyName}
          location={selectedJob.location}
          type={selectedJob.type}
          createdAt={selectedJob.createdAt}
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

        <DragOverlay>{renderOverlay()}</DragOverlay>
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
