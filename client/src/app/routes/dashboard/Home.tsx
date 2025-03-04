import { LuKanbanSquare } from "react-icons/lu";

import { AppContentLayout } from "@components/layout";
import { LinkButton } from "@components/ui/button";
import { PathConstants } from "@utils/constants";

import ActiveBoardList from "@features/boards/components/ActiveBoardList";
import { DailyGoalProgress } from "@features/job-applications/components/daily-goal-progress";

const Home = () => {
  return (
    <AppContentLayout title="Home">
      <div className="mx-auto w-[90%] max-w-[760px]">
        <div className="flex flex-col space-y-8 pt-16">
          <DailyGoalProgress />

          <div className="!mt-12">
            <div className="flex items-center justify-between border-b border-border pt-4 pb-4 mb-7">
              <div className="flex items-center">
                <LuKanbanSquare className="stroke-foreground stroke-width-[0.1px] h-6 w-6 mr-3" />
                <h1 className="text-foreground text-lg font-semibold">
                  Job Tracking Boards
                </h1>
              </div>
              <LinkButton
                to={PathConstants.ARCHIVED_BOARDS}
                size="sm"
              >
                Archived Boards
              </LinkButton>
            </div>

            <ActiveBoardList />
          </div>
        </div>
      </div>
    </AppContentLayout>
  );
};

export default Home;
