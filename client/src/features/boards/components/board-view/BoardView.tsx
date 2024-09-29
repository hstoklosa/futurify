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
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useBoardStages } from "@features/boards/api/getBoardStages";
import { useJobApplications } from "@features/job-applications/api/getApplications";
import BoardViewContainer from "./BoardViewContainer";
import BoardViewItem from "./BoardViewItem";
import { Application } from "@/types/api";

type BoardViewProps = {
  boardId: string;
  children?: React.ReactNode;
};

const BoardView = ({ boardId }: BoardViewProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const { data: stages } = useBoardStages({ id: boardId });
  const { data: jobs } = useJobApplications({});

  const stageToJobsMap = useMemo(() => {
    const map = new Map<number, Application[]>(
      stages.data.map((stage) => [stage.id, []])
    );

    jobs.data.forEach(
      (job) => map.has(job.stageId) && map.get(job.stageId)!.push(job)
    );

    return map;
  }, [jobs, stages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    logEvent("DragStart", event);
    setActiveId(event.active.id);
  };

  const onDragOver = (event: DragOverEvent) => {
    logEvent("DragOver", event);
  };

  const onDragEnd = (event: DragEndEvent) => {
    logEvent("DragEnd", event);
    setActiveId(null);
  };

  const renderOverlay = () => {
    const selectedJob = activeId && jobs.data.find((job) => job.id === activeId);

    if (!selectedJob) {
      return <div />;
    }

    return <BoardViewItem {...selectedJob} />;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="h-full flex">
        {stages.data.map((stage) => (
          <SortableContext
            key={stage.id}
            items={stages.data.map((stage) => stage.name)}
            strategy={horizontalListSortingStrategy}
          >
            <BoardViewContainer
              boardId={boardId}
              id={stage.id}
              name={stage.name}
            >
              <SortableContext
                items={stageToJobsMap.get(stage.id)!.map((job) => job.id)}
                strategy={verticalListSortingStrategy}
              >
                {stageToJobsMap.get(stage.id)!.map((job) => (
                  <BoardViewItem
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company}
                  />
                ))}
              </SortableContext>
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
