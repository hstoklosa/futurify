import { QueryClient, useQueries } from "@tanstack/react-query";
import { LoaderFunctionArgs, useParams } from "react-router-dom";
import { LuAlertCircle, LuInfo } from "react-icons/lu";

import { AppContentLayout } from "@components/layout";
import { Spinner } from "@components/ui/spinner";
import { Button } from "@components/ui/button";
import { ExportJobsDropdown } from "@/features/job-applications/components";

import { getBoardQueryOptions } from "@/features/boards/api/get-board";
import { getBoardStagesOptions } from "@/features/boards/api/get-board-stages";
import { getJobsOptions } from "@features/job-applications/api/get-jobs";
import BoardView from "@/features/boards/components/board-view/board-view";

/*
 *  TODO: Explore react-router handling vs react-query handling through error bubbling
 *        https://github.com/remix-run/react-router/discussions/10166#discussioncomment-8422831
 */
export const boardLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const boardId = params.id as string;
    const boardQuery = getBoardQueryOptions(boardId);
    const stagesQuery = getBoardStagesOptions(boardId);

    return Promise.all([
      queryClient.ensureQueryData(boardQuery),
      queryClient.ensureQueryData(stagesQuery),
    ]);
  };

const Board = () => {
  const { id } = useParams() as { id: string };
  const queryResults = useQueries({
    queries: [
      getBoardQueryOptions(id),
      getBoardStagesOptions(id),
      getJobsOptions(id),
    ],
  });

  const [boardQuery, stagesQuery, jobsQuery] = queryResults;

  if (queryResults.some((result) => result.isPending))
    return (
      <Spinner
        size="md"
        className="h-full"
      />
    );

  if (!boardQuery.isSuccess || !stagesQuery.isSuccess || !jobsQuery.isSuccess) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LuAlertCircle className="h-6 w-6 text-destructive" />
          <h1 className="text-xl font-medium">Error loading board data</h1>
        </div>
      </div>
    );
  }

  if (boardQuery.data.data.archived) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <LuInfo className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-xl font-medium">This board has been archived</h1>
        </div>
      </div>
    );
  }

  // if (queryResults.find((result) => !result.isSuccess)) {
  //   return <h1 className="">This board has been archived</h1>;
  // }

  const board = boardQuery.data;

  return (
    <AppContentLayout title={`${board.data.name}`}>
      {/* TODO: Create AppContentHeader */}
      <div className="flex items-center justify-between md:left-[215px] h-[45px] px-2 border-border border-b sticky top-0 left-0 right-0 bg-background z-10">
        <h1 className="text-secondary text-sm font-bold">{board.data.name}</h1>
        <div className="flex items-center gap-2">
          <ExportJobsDropdown
            boardId={id}
            buttonSize="sm"
            buttonVariant="ghost"
          />
          <Button
            className="text-white"
            size="md"
          >
            + New
          </Button>
        </div>
      </div>

      <div className="flex-1 h-[calc(100vh-45px)] overflow-x-scroll">
        <BoardView boardId={id} />
      </div>
    </AppContentLayout>
  );
};

export default Board;
