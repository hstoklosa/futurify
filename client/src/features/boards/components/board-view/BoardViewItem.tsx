import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuMapPin, LuBuilding, LuCalendarPlus } from "react-icons/lu";

import { cn } from "@utils/cn";

import { JobType } from "@schemas/job-application";
import { formatUTCDate } from "@/utils/format";

type BoardViewItemProps = {
  id: number;
  title: string;
  companyName: string;
  type: JobType;
  location: string;
  createdAt: string;
};

const BoardViewItem = ({
  id,
  title,
  companyName,
  type,
  location,
  createdAt,
}: BoardViewItemProps) => {
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
        "bg-background border-border border-[1px] rounded-md px-4 py-3 mt-1 my-2",
        isDragging && "opacity-0"
      )}
    >
      <h3 className="text-[15px] !text-foreground font-semibold flex items-center">
        {title}
      </h3>
      <div className="text-sm text-foreground/70 space-y-[2px] [&>*]:flex [&>*]:items-center">
        <p>
          <LuBuilding className="stroke-foreground/40 mr-2" />
          {companyName}
        </p>
        <p>
          <LuMapPin className="stroke-foreground/40 mr-2" />
          {location} &nbsp;
          {type === JobType.REMOTE && <span className="">(Remote)</span>}
          {type === JobType.HYBRID && <span className="">(Hybrid)</span>}
          {type === JobType.ON_SITE && <span className="">(On-site)</span>}
        </p>
        <p>
          <LuCalendarPlus className="stroke-foreground/40 mr-2" />
          <p>{formatUTCDate(createdAt)}</p>
        </p>
      </div>
    </div>
  );
};

export default BoardViewItem;
