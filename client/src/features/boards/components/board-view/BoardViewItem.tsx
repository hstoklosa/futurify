import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@utils/cn";

type BoardViewItemProps = {
  id: number;
  title: string;
  company: string;
};

const BoardViewItem = ({ id, title, company }: BoardViewItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: id,
      data: { type: "item" },
    });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  } as React.CSSProperties;

  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-background border-border border-[1px] rounded-md p-3 my-2 h-[75px]",
        isDragging && "opacity-0"
      )}
    >
      <h3 className="text-foreground">{title}</h3>
      <p className="text-foreground">{company}</p>
    </div>
  );
};

export default BoardViewItem;
