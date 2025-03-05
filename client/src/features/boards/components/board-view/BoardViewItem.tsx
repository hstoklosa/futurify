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
        data: { type: "item", id },
        disabled: isDragOverlay,
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

    // Enhanced style handling for better drag and drop experience
    const style = {
      // Only apply transition when not actively dragging for smoother movement
      transition: isDragging || isDragOverlay ? undefined : transition,
      // Add transform for position
      transform: isDragOverlay ? undefined : CSS.Transform.toString(transform),
      // Ensure cursor shows as grabbable
      cursor: "grab",
      // Ensure proper stacking during drag operations
      zIndex: isDragOverlay ? 1000 : isDragging ? 100 : 1,
      // Don't make the original item invisible, make it semi-transparent instead
      opacity: isDragging ? 0.4 : 1,
      // Add box shadow for drag overlay to show elevation
      boxShadow: isDragOverlay ? "0 5px 15px rgba(0,0,0,0.15)" : undefined,
    } as React.CSSProperties;

    return (
      <div
        {...(isDragOverlay ? {} : attributes)}
        {...(isDragOverlay ? {} : listeners)}
        ref={isDragOverlay ? undefined : setNodeRef}
        style={style}
        data-id={id}
        className={cn(
          "bg-background w-full max-w-[300px] rounded-md px-4 py-3 my-2",
          "hover:shadow-[inset_0_0_0_2px_rgb(var(--primary))] hover:border-transparent",
          "transition-all duration-200 ease-in-out",
          !isDragOverlay && "border-border border-[1px]",
          isDragging && "border-primary/40",
          isDragOverlay && [
            "shadow-lg",
            "shadow-primary/10",
            "transform-none",
            "!border-primary",
            "!border-solid",
            "!bg-background",
            "scale-[1.02]", // Slightly larger when dragging for better visibility
          ]
        )}
      >
        <h3 className="flex items-center text-[15px] font-semibold !text-foreground mb-1 truncate">
          {title}
        </h3>
        <div className="text-sm ml-0.5 text-foreground/70 space-y-[1px] [&>*]:flex [&>*]:items-center">
          <div className="truncate">
            <LuBuilding className="stroke-foreground/40 mr-2 flex-shrink-0" />
            <span className="truncate">{companyName}</span>
          </div>
          <div className="truncate">
            <LuMapPin className="stroke-foreground/40 mr-2 flex-shrink-0" />
            <span className="truncate">
              {location} ({jobType})
            </span>
          </div>
        </div>
      </div>
    );
  }
);

BoardViewItem.displayName = "BoardViewItem";

export default BoardViewItem;
