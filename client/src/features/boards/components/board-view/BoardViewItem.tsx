import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuMapPin, LuBuilding } from "react-icons/lu";

import { cn } from "@utils/cn";

import { JobType } from "@schemas/job-application";

type BoardViewItemProps = {
  id: number;
  title: string;
  companyName: string;
  type: JobType;
  location: string;
  createdAt: string;
  isDragOverlay?: boolean;
};

const BoardViewItem = React.forwardRef<HTMLButtonElement, BoardViewItemProps>(
  (
    { id, title, companyName, type, location, createdAt: _, isDragOverlay = false },
    _ref
  ) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({
        id: id,
        data: { type: "item" },
      });

    // Convert numeric enum to string safely
    let jobType = "";
    if (typeof type === "number") {
      switch (type) {
        case JobType.ON_SITE:
          jobType = "On-Site";
          break;
        case JobType.REMOTE:
          jobType = "Remote";
          break;
        case JobType.HYBRID:
          jobType = "Hybrid";
          break;
        default:
          jobType = "";
      }
    }

    const style = {
      transition: isDragOverlay ? undefined : transition,
      transform: isDragOverlay ? undefined : CSS.Transform.toString(transform),
      cursor: "grab",
      zIndex: isDragOverlay ? 1000 : 1,
      width: isDragOverlay ? "300px" : undefined,
    } as React.CSSProperties;

    return (
      <div
        {...(isDragOverlay ? {} : attributes)}
        {...(isDragOverlay ? {} : listeners)}
        ref={isDragOverlay ? undefined : setNodeRef}
        style={style}
        className={cn(
          "bg-background w-full border-border border-[1px] rounded-md px-4 py-3 my-2",
          "hover:shadow-[inset_0_0_0_2px_rgb(var(--primary))] hover:border-transparent",
          "transition-all duration-200 ease-in-out",
          isDragging && "opacity-0",
          isDragOverlay &&
            "shadow-lg shadow-primary/10 transform-none rounded-md border-[2px] border-primary"
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
        </div>
      </div>
    );
  }
);

export default BoardViewItem;
