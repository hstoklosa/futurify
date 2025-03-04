import { LuTarget } from "react-icons/lu";
import { Progress } from "@components/ui/progress";
import { useGetDailyGoal } from "@features/auth/api/user";
import { useGetTodayApplicationsCount } from "../api/get-today-applications";

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

  if (hasError) {
    return (
      <div>
        <div className="flex items-center border-b border-border pt-4 pb-4 mb-7">
          <LuTarget className="stroke-foreground stroke-width-[0.1px] h-6 w-6 mr-3" />
          <h1 className="text-foreground text-lg font-semibold">Daily Goal</h1>
        </div>
        <div className="text-sm text-destructive">
          Failed to load daily goal progress
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center border-b border-border pt-4 pb-4 mb-7">
        <LuTarget className="stroke-foreground stroke-width-[0.1px] h-6 w-6 mr-3" />
        <h1 className="text-foreground text-lg font-semibold">Daily Goal</h1>
      </div>

      <div className="flex flex-col space-y-4">
        <Progress
          value={progress}
          className="h-3 w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {isLoading ? "Loading..." : `${todayCount} applications today`}
          </span>
          <span>Goal: {isLoading ? "..." : dailyGoal}</span>
        </div>
      </div>
    </div>
  );
};
