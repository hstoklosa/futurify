import { QueryClient, useQueries } from "@tanstack/react-query";
import { LoaderFunctionArgs, useParams } from "react-router-dom";

import { AppContentLayout } from "@components/layout";
import { Spinner } from "@components/ui/spinner";
import { Button } from "@components/ui/button";

import { useBoard, getBoardQueryOptions } from "@features/boards/api/getBoard";
import {
  getBoardStagesOptions,
  useBoardStages,
} from "@features/boards/api/getBoardStages";
import { useJobs, getJobsOptions } from "@features/job-applications/api/get-jobs";
import BoardView from "@features/boards/components/board-view/BoardView";

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
    <Spinner
      size="lg"
      className="h-96"
    />;

  if (!boardQuery.isSuccess || !stagesQuery.isSuccess || !jobsQuery.isSuccess) {
    return <h1>This board has been archived</h1>;
  }

  if (boardQuery.data.data.archived) {
    return <h1>This board has been archived</h1>;
  }

  // if (queryResults.find((result) => !result.isSuccess)) {
  //   return <h1 className="">This board has been archived</h1>;
  // }

  const board = boardQuery.data;

  return (
    <AppContentLayout title={`${board.data.name}`}>
      {/* TODO: Create AppContentHeader */}
      {/* px-2 */}
      <div className="flex items-center justify-between md:left-[215px] min-w-0 min-h-[45px] px-2 border-border border-b fixed top-0 left-0 right-0">
        <h1 className="text-secondary text-sm font-bold">{board.data.name}</h1>
        <Button
          className="text-white"
          size="md"
        >
          + New
        </Button>
      </div>

      <BoardView boardId={id} />
    </AppContentLayout>
  );
};

export default Board;
