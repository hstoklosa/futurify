import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuMapPin, LuBuilding, LuCalendarPlus } from "react-icons/lu";

import { cn } from "@utils/cn";
import { formatUTCDate } from "@utils/format";

import { JobType } from "@schemas/job-application";

type BoardViewItemProps = {
  id: number;
  title: string;
  companyName: string;
  type: JobType;
  location: string;
  createdAt: string;
};

const BoardViewItem = React.forwardRef<HTMLButtonElement, BoardViewItemProps>(
  ({ id, title, companyName, type, location, createdAt }, ref) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({
        id: id,
        data: { type: "item" },
      });

    const formattedDate = formatUTCDate(createdAt);
    const jobType = JobType[type];

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
          "bg-background w-full border-border border-[1px] rounded-md px-4 py-3 my-2 hover:shadow-[inset_0_0_0_2px_rgb(var(--primary))] hover:border-transparent",
          isDragging && "opacity-0"
        )}
      >
        <h3 className="flex items-center text-[15px] font-semibold !text-foreground mb-1">
          {title}
        </h3>
        <div className="text-sm ml-0.5 text-foreground/70 space-y-[1px] [&>*]:flex [&>*]:items-center">
          <div>
            <LuBuilding className="stroke-foreground/40 mr-2" />
            <span>{companyName}</span>
          </div>
          <div>
            <LuMapPin className="stroke-foreground/40 mr-2" />
            <span>
              {location} ({jobType})
            </span>
          </div>
          {/* <div>
            <LuCalendarPlus className="stroke-foreground/40 mr-2" />
            <span>{formattedDate}</span>
          </div> */}
        </div>
      </div>
    );
  }
);

export default BoardViewItem;
