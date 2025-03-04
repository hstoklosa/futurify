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
  children?: React.ReactNode;
};

const BoardViewContainer = ({
  boardId,
  items,
  id,
  name,
  children,
}: BoardViewContainerProps) => {
  const { setNodeRef, isOver, over } = useDroppable({
    id: name,
    data: { type: "container" },
  });

  const isOverContainer = isOver || (over?.id && items.includes(over.id));

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex-1 flex flex-col h-[97%] py-4 bg-[rgba(25,4,69,0.01)] shadow-4xl border-border border-[1px] rounded-xl",
        isOverContainer &&
          "after:absolute after:z-50 after:inset-0 after:bg-primary/15 after:ring-2 after:ring-primary after:rounded-xl after:pointer-events-none"
      )}
    >
      <div className="flex flex-col justify-center items-center mb-2 px-4">
        <div className="w-full flex items-center">
          <h2 className="font-semibold text-lg text-secondary mr-2 tracking-wider">
            {name.toUpperCase()}
          </h2>
          <div className="text-[12px] text-primary rounded-lg bg-[rgba(106,79,235,0.1)] px-2">
            {pluralise(items.length, "job").toUpperCase()}
          </div>
        </div>

        <CreateJobDialog
          boardId={boardId}
          stageId={id}
        >
          <Button
            variant="outlineMuted"
            className="text-sm text-foreground/70 h-9 w-full rounded-md shadow-4xl p-3 mt-2"
          >
            + NEW
          </Button>
        </CreateJobDialog>
      </div>

      <div className="flex-1 overflow-hidden w-[300px]">
        <ScrollArea className="h-full px-4">{children}</ScrollArea>
      </div>
    </div>
  );
};

export default BoardViewContainer;
