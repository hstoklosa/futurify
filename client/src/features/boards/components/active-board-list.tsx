import { Link } from "react-router-dom";

import { Spinner } from "@components/ui/spinner";
import { Button } from "@components/ui/button";
import { formatRelativeTime } from "@utils/format";
import { PathConstants } from "@utils/constants";

import { useActiveBoards } from "../api/get-active-boards";
import CreateBoard from "./create-board";

const ActiveBoardList = () => {
  const activeBoardsQuery = useActiveBoards({});

  if (activeBoardsQuery.isLoading) {
    return (
      <Spinner
        size="lg"
        className="h-96"
      />
    );
  }

  const activeBoards = activeBoardsQuery.data?.data;

  return (
    <div className="grid auto-fill-[240px] gap-4">
      {activeBoards &&
        activeBoards.map(({ id, name, createdAt }) => (
          <Link
            key={id}
            to={PathConstants.BOARD_VIEW(id)}
            className="h-full shadow-4xl p-4 rounded-md border-border border-[1px]"
          >
            <h2 className="text-foreground font-semibold mb-2 truncate">{name}</h2>
            <p className="text-foreground/40 text-xs">
              created {formatRelativeTime(new Date(createdAt))}
            </p>
          </Link>
        ))}
      <CreateBoard>
        <Button
          variant="outlineMuted"
          className="text-foreground/70 h-full shadow-4xl p-3"
        >
          + Create Board
        </Button>
      </CreateBoard>
    </div>
  );
};

export default ActiveBoardList;
