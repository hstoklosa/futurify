import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  UniqueIdentifier,
  useSensors,
  useSensor,
  PointerSensor,
  closestCenter,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { Job } from "@/types/api";
import { useBoardStages } from "@features/boards/api/getBoardStages";
import { useJobs, getJobsOptions } from "@features/job-applications/api/get-jobs";

import BoardViewContainer from "./BoardViewContainer";
import BoardViewItem from "./BoardViewItem";

type BoardViewProps = {
  boardId: string;
  children?: React.ReactNode;
};

const BoardView = ({ boardId }: BoardViewProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const stagesQuery = useBoardStages({ id: boardId });
  const jobsQuery = useJobs({ boardId: boardId });

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

  console.log(stageJobsMap);

  const findBoardItem = (id: number) => {
    return jobs.data.find((job) => job.id === id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    logEvent("DragStart", event);
  };

  const onDragOver = (event: DragOverEvent) => {
    logEvent("DragOver", event);
  };

  const onDragEnd = (event: DragEndEvent) => {
    logEvent("DragEnd", event);
  };

  const renderOverlay = () => {
    const selectedJob = activeId && findBoardItem(activeId as number);

    if (selectedJob) return <BoardViewItem {...selectedJob} />;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="h-full w-max flex px-8 pt-[1rem] mt-[55px] overflow-y-auto">
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
                <BoardViewItem
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  companyName={job.companyName}
                  location={job.location}
                  type={job.type}
                  createdAt={job.createdAt}
                />
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
