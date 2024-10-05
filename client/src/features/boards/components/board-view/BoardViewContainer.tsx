import React from "react";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

import { Button } from "@components/ui/button";
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
        "h-[97%] flex flex-col flex-1 min-w-72 mr-4 px-4 pt-4 relative bg-background shadow-4xl border-[rgba(25,4,69,0.05)] border-[1px] rounded-md",
        isOverContainer &&
          "after:absolute after:z-50 after:inset-0 after:bg-primary/15 after:ring-2 after:ring-primary after:rounded-md after:pointer-events-none"
      )}
    >
      <div className="flex flex-col justify-center items-center mb-2">
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
            onClick={() => console.log("Create job")}
          >
            + NEW
          </Button>
        </CreateJobDialog>
      </div>

      <div className={cn("flex-1 overflow-y-auto w-[272px] h-[97%]")}>
        {children}
      </div>
    </div>
  );
};

export default BoardViewContainer;
