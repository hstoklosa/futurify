import { LuArchive } from "react-icons/lu";

import { AppContentLayout } from "@components/layout";
import ArchivedBoardList from "@/features/boards/components/archived-board-list";

const ArchivedBoards = () => {
  return (
    <AppContentLayout title="Archived Boards">
      <div className="mx-auto w-[90%] max-w-[760px] h-full">
        <div className="flex items-center pt-16 mb-5">
          <LuArchive className="stroke-foreground stroke-width-[0.1px] h-4 w-4 mr-2" />
          <p className="text-foreground font-normal leading-[23px]">
            Archived Boards
          </p>
        </div>

        <ArchivedBoardList />
      </div>
    </AppContentLayout>
  );
};

export default ArchivedBoards;
