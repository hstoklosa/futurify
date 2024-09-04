import { Spinner } from "@components/ui/spinner";
import { Button } from "@components/ui/button";
import { formatRelativeTime } from "@utils/format";

import { useArchivedBoards } from "../api/getArchivedBoards";

const ActiveBoardList = () => {
  const archivedBoardsQuery = useArchivedBoards({});

  if (archivedBoardsQuery.isLoading) {
    return (
      <Spinner
        size="lg"
        className="h-96"
      />
    );
  }

  const archivedBoards = archivedBoardsQuery.data?.data;

  if (!archivedBoards) return null;

  return (
    <div className="grid auto-fill-[240px] gap-4">
      {archivedBoards.map(({ id, name, createdAt }) => (
        <div
          key={id}
          className="h-full shadow-4xl p-4 rounded-md border-border border-[1px]"
        >
          <h2 className="text-foreground mb-1">{name}</h2>
          <p className="text-foreground/40 text-sm">
            created {formatRelativeTime(new Date(createdAt))}
          </p>
          <Button
            size="sm"
            className="mt-6 text-sm"
            onClick={() => console.log("restore board")}
          >
            Restore
          </Button>
        </div>
      ))}

      {!archivedBoards?.length && (
        <p className="text-foreground/40 text-lg">No archived boards found...</p>
      )}
    </div>
  );
};

export default ActiveBoardList;
