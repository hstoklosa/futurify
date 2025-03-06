import { LuTarget } from "react-icons/lu";
import { FiCheck, FiClock } from "react-icons/fi";
import { Progress } from "@components/ui/progress";
import { useGetDailyGoal } from "@features/auth/api/user";
import { useGetTodayApplicationsCount } from "../api/get-today-applications";
import { cn } from "@utils/cn";

export const DailyGoalProgress = () => {
  const {
    data: dailyGoalResponse,
    isLoading: isDailyGoalLoading,
    error: dailyGoalError,
  } = useGetDailyGoal();

  const {
    data: todayCountResponse,
    isLoading: isTodayCountLoading,
    error: todayCountError,
  } = useGetTodayApplicationsCount();

  const isLoading = isDailyGoalLoading || isTodayCountLoading;
  const hasError = dailyGoalError || todayCountError;

  // Default to 5 if no goal is set (as per backend default)
  const dailyGoal = dailyGoalResponse?.data ?? 5;
  const todayCount = todayCountResponse?.data ?? 0;

  const progress =
    dailyGoal > 0 ? Math.min((todayCount / dailyGoal) * 100, 100) : 0;

  const isGoalCompleted = todayCount >= dailyGoal;

  if (hasError) {
    return (
      <div className="rounded-lg border border-border p-4 shadow-sm">
        <div className="flex items-center mb-4">
          <LuTarget className="stroke-foreground h-5 w-5 mr-2" />
          <h1 className="text-foreground text-base font-semibold">Daily Goal</h1>
        </div>
        <div className="text-sm text-destructive flex items-center">
          <span>Failed to load daily goal progress</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <LuTarget className="stroke-foreground h-5 w-5 mr-2" />
          <h1 className="text-foreground text-base font-semibold">Daily Goal</h1>
        </div>
        {isGoalCompleted && (
          <div className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <FiCheck className="h-3 w-3 mr-1" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-3">
        <div className="relative">
          <Progress
            value={progress}
            className={cn(
              "h-2.5 w-full",
              isGoalCompleted ? "bg-green-100 dark:bg-green-900/30" : "bg-secondary"
            )}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <div className="h-1.5 w-8 rounded-full bg-muted animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm">
            {isLoading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              <div className="flex items-center">
                <span className="font-medium text-foreground">{todayCount}</span>
                <span className="text-muted-foreground ml-1">
                  / {dailyGoal} applications
                </span>
              </div>
            )}
          </div>

          {!isLoading && !isGoalCompleted && (
            <div className="flex items-center text-xs text-muted-foreground">
              <FiClock className="h-3 w-3 mr-1" />
              <span>{dailyGoal - todayCount} more to go</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
