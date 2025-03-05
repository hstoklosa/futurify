import React from "react";
import { useGetJobInsights } from "../api/get-job-insights";
import { Spinner } from "@components/ui/spinner";

interface JobInsightsProps {
  jobId: number;
}

export const JobInsights: React.FC<JobInsightsProps> = ({ jobId }) => {
  const { data, isLoading, isError, error } = useGetJobInsights({ jobId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner
          size="md"
          className="h-full"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-destructive">
        <p>
          Error loading insights: {(error as Error)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  const {
    responsibilities = [],
    qualifications = [],
    keywords = [],
  } = data?.data || {};

  if (
    !data?.data ||
    (responsibilities.length === 0 &&
      qualifications.length === 0 &&
      keywords.length === 0)
  ) {
    return (
      <div>
        <p className="text-muted-foreground">No insights available for this job.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
          <div className="w-full md:w-1/2">
            <h3 className="text-base font-semibold text-secondary mb-1">
              Responsibilities
            </h3>
            <p className="text-secondary text-sm mb-4">What you'll be doing</p>
            <ul className="space-y-2 list-disc pl-4">
              {responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="text-sm pl-1"
                >
                  <span className="relative -left-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="text-base font-semibold text-secondary mb-1">
              Qualifications
            </h3>
            <p className="text-secondary text-sm mb-4">What they're looking for</p>
            <ul className="text-secondary space-y-2 list-disc pl-4">
              {qualifications.map((item, index) => (
                <li
                  key={index}
                  className="text-secondary text-sm pl-1"
                >
                  <span className="relative -left-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full pt-6 md:pt-0 border-t md:border-t-0">
          <h3 className="text-base font-semibold text-secondary mb-3">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="inline-flex items-center bg-[rgb(214,203,255)] rounded-md px-3 py-1"
              >
                <span className="text-xs font-medium mr-2">{index + 1}</span>
                <span className="text-sm">{keyword}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
