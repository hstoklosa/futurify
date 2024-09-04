import { LuUserCircle } from "react-icons/lu";

import { LinkButton } from "@components/ui/button";
import { PathConstants } from "@utils/constants";

import ActiveBoardList from "@features/boards/components/ActiveBoardList";

const Home = () => {
  return (
    <div className="mx-auto w-[90%] max-w-[760px]">
      <div className="flex items-center justify-between border-b border-border pt-16 pb-4 mb-8">
        <div className="flex items-center">
          <LuUserCircle className="stroke-foreground stroke-width-[0.1px] h-5 w-5 mr-2" />
          <h1 className="text-foreground text-lg font-semibold">
            My Tracking Boards
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
  );
};

export default Home;
