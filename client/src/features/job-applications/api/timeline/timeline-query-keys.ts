// Query keys for job timeline events
export const timelineQueryKeys = {
  all: ["job-timeline"] as const,
  lists: () => [...timelineQueryKeys.all, "list"] as const,
  list: (jobId: number) => [...timelineQueryKeys.lists(), { jobId }] as const,
};
