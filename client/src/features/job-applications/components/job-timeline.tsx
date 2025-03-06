import React from "react";
import { format } from "date-fns";
import {
  LuPlus,
  LuPencil,
  LuArrowLeftRight,
  LuTrash,
  LuInfo,
} from "react-icons/lu";

import { Spinner } from "@components/ui/spinner";
import { useGetJobTimeline, parseTimelineDetails } from "../api/timeline";
import { JobEventType } from "@/types/api";

// Icon mapping for different event types
const eventIcons: Record<JobEventType, React.ReactElement> = {
  CREATED: <LuPlus className="h-4 w-4" />,
  UPDATED: <LuPencil className="h-4 w-4" />,
  STAGE_CHANGED: <LuArrowLeftRight className="h-4 w-4" />,
  DELETED: <LuTrash className="h-4 w-4" />,
};

// Colors for different event types
const eventColors: Record<JobEventType, string> = {
  CREATED: "bg-green-500",
  UPDATED: "bg-blue-500",
  STAGE_CHANGED: "bg-purple-500",
  DELETED: "bg-red-500",
};

interface TimelineEventProps {
  type: JobEventType;
  description: string;
  details: string;
  timestamp: string;
  isLastItem: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  type,
  description,
  details,
  timestamp,
  isLastItem,
}) => {
  const icon = eventIcons[type] || <LuInfo className="h-4 w-4" />;
  const colorClass = eventColors[type] || "bg-gray-500";
  const parsedDetails = parseTimelineDetails(details);

  // Format the timestamp
  const formattedDate = format(new Date(timestamp), "MMM d, yyyy");
  const formattedTime = format(new Date(timestamp), "h:mm a");

  return (
    <div className="relative flex mb-4">
      {/* Timeline vertical line */}
      {!isLastItem && (
        <div
          className="absolute left-[14px] top-8 h-full border-l-2 border-dashed border-border"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Icon with colored background */}
      <div className="mr-3 flex-shrink-0 z-10">
        <div
          className={`p-2 rounded-full ${colorClass} text-white flex items-center justify-center shadow-sm`}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="flex flex-col">
          <h4 className="text-sm font-medium">{description}</h4>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Details section */}
        {parsedDetails && (
          <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
            {Object.entries(parsedDetails).map(([key, value]) => (
              <div
                key={key}
                className="mb-1"
              >
                {/* Format differently based on event type */}
                {type === "UPDATED" ? (
                  <div>{String(value)}</div>
                ) : (
                  <div>
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    : {String(value)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface JobTimelineProps {
  jobId: number;
}

export const JobTimeline: React.FC<JobTimelineProps> = ({ jobId }) => {
  const { data, isLoading, error } = useGetJobTimeline({ jobId });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        Error loading timeline data
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No timeline events found
      </div>
    );
  }

  return (
    <div className="timeline-container mt-2 pr-3 px-2">
      <div className="space-y-1">
        {data.data.map((event, index) => (
          <TimelineEvent
            key={event.id}
            type={event.eventType}
            description={event.description}
            details={event.details}
            timestamp={event.timestamp || event.createdAt}
            isLastItem={index === data.data.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
