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
      <div className="p-4 text-destructive">
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
      <div className="p-6 h-full">
        <h2 className="text-2xl font-semibold mb-8">AI Powered Summary</h2>
        <p className="text-muted-foreground">No insights available for this job.</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between">
        <div className="w-[70%] pr-6">
          <h2 className="text-2xl font-semibold mb-8">AI Powered Summary</h2>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-1">Responsibilities</h3>
              <p className="text-muted-foreground text-sm mb-4">
                What you'll be doing
              </p>
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

            <div>
              <h3 className="text-lg font-semibold mb-1">Qualifications</h3>
              <p className="text-muted-foreground text-sm mb-4">
                What they're looking for
              </p>
              <ul className="space-y-2 list-disc pl-4">
                {qualifications.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm pl-1"
                  >
                    <span className="relative -left-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-[30%] pl-6 border-l">
          <h3 className="text-lg font-semibold mb-6">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="inline-flex items-center bg-primary/10 rounded-md px-3 py-1"
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
