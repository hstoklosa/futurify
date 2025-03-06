import React from "react";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { pluralise } from "@utils/format";
import { cn } from "@utils/cn";

import CreateJobDialog from "@features/job-applications/components/create-job-dialog";

type BoardViewContainerProps = {
  boardId: string;
  items: UniqueIdentifier[];
  id: number;
  name: string;
  disabled?: boolean;
  isActiveStage?: boolean;
  children?: React.ReactNode;
};

const BoardViewContainer = ({
  boardId,
  items,
  id,
  name,
  isActiveStage = false,
  children,
}: BoardViewContainerProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: name,
    data: { type: "container", id },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex-1 flex flex-col h-full py-4 bg-[rgba(25,4,69,0.01)] shadow-4xl border-border border-r-[1px]",
        isOver &&
          "after:absolute after:z-50 after:inset-0 after:bg-primary/10 after:ring-2 after:ring-primary after:rounded-xl after:pointer-events-none",
        isActiveStage &&
          !isOver &&
          "after:absolute after:z-50 after:inset-0 after:bg-primary/5 after:ring-1 after:ring-primary/50 after:rounded-xl after:pointer-events-none",
        "transition-all duration-200"
      )}
    >
      <div className="flex flex-col justify-center items-center mb-2 px-4">
        <div className="w-full flex items-center justify-between">
          <h2
            className={cn(
              "font-semibold text-lg text-secondary mr-2 tracking-wide",
              (isOver || isActiveStage) && "text-primary"
            )}
          >
            {name.toUpperCase()}
          </h2>
          <div
            className={cn(
              "text-[12px] text-primary rounded-lg bg-[rgba(106,79,235,0.1)] px-2",
              isOver && "bg-primary/20"
            )}
          >
            {pluralise(items.length, "job").toUpperCase()}
          </div>
        </div>

        <CreateJobDialog
          boardId={boardId}
          stageId={id}
        >
          <Button
            variant="outlineMuted"
            className={cn(
              "text-sm text-foreground/70 h-9 w-full rounded-md shadow-4xl p-3 mt-2",
              isOver && "bg-primary/5 border-primary/30"
            )}
          >
            + NEW
          </Button>
        </CreateJobDialog>
      </div>

      <div className="flex-1 overflow-hidden w-[300px]">
        <ScrollArea className="h-full px-4">
          {/* If container is empty, show a drop zone indicator when dragging */}
          {isOver && items.length === 0 && (
            <div className="border-2 border-dashed border-primary/40 rounded-md h-24 flex items-center justify-center my-2">
              <p className="text-primary/60 text-sm">Drop here</p>
            </div>
          )}
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};

export default BoardViewContainer;
