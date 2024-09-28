import { useDroppable } from "@dnd-kit/core";
import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@components/ui/button";
import { pluralise } from "@utils/format";
import { cn } from "@utils/cn";

import { useJobApplications } from "@features/job-applications/api/getApplications";
import BoardViewItem from "./BoardViewItem";
import React from "react";

type BoardViewContainerProps = {
  id: number;
  name: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

// const animateLayoutChanges: AnimateLayoutChanges = (args) =>
//   defaultAnimateLayoutChanges({ ...args, wasDragging: true, isSorting: true });

/*
 * Presentational component of the board container to
 * decouple from @dnd-kit when rendering overlays.
 */
const BoardViewContainer = ({ id, name, children }: BoardViewContainerProps) => {
  const { setNodeRef } = useDroppable({ id: name });

  const { data: jobs } = useJobApplications({
    select: (data) => data.stageId === id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn("h-full min-w-72 border-border border-r px-3 pt-8")}
    >
      <div className="flex flex-col justify-center items-center mb-6">
        <h2 className="font-semibold text-sm text-secondary tracking-wider">
          {name.toUpperCase()}
        </h2>
        <p className="text-sm text-foreground/50">
          {pluralise(jobs.data.length, "job").toUpperCase()}
        </p>
        <Button
          variant="outlineMuted"
          className="text-xl text-foreground/70 h-9 w-full rounded-md shadow-4xl p-3 mt-5"
          onClick={() => console.log("Create job")}
        >
          +
        </Button>
      </div>

      {children}
    </div>
  );
};

export default BoardViewContainer;
