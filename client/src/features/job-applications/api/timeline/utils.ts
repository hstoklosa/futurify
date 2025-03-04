/**
 * Parse timeline event details from JSON string
 * @param detailsJson JSON string from the API
 * @returns Parsed details object or null if invalid
 */
export function parseTimelineDetails<T = Record<string, unknown>>(
  detailsJson: string | null
): T | null {
  if (!detailsJson) return null;

  try {
    return JSON.parse(detailsJson) as T;
  } catch (error) {
    console.error("Failed to parse timeline details:", error);
    return null;
  }
}

/**
 * Format a timeline event for display
 * @param details The parsed details object
 * @param eventType The type of event
 * @returns Formatted details for display
 */
export function formatTimelineEvent(
  details: Record<string, unknown> | null,
  eventType: string
): string {
  if (!details) return "";

  switch (eventType) {
    case "CREATED":
      return `Created job application for ${details.title} at ${details.company}`;

    case "UPDATED":
      // For updates, the details are a map of what changed
      return Object.entries(details)
        .map(([_key, value]) => `${value}`)
        .join("\n");

    case "STAGE_CHANGED":
      return `Stage changed from ${details.previousStage} to ${details.newStage}`;

    case "POSITION_CHANGED":
      return `Position changed from position ${details.previousPosition} to ${details.newPosition}`;

    default:
      return JSON.stringify(details);
  }
}
