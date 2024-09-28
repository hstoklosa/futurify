import { QueryClient, useQueries } from "@tanstack/react-query";
import { LoaderFunctionArgs, useParams } from "react-router-dom";

import { AppContentLayout } from "@components/layout";
import { Spinner } from "@components/ui/spinner";

import { useBoard, getBoardQueryOptions } from "@features/boards/api/getBoard";
import { getBoardStagesOptions } from "@features/boards/api/getBoardStages";
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
  const {
    data: board,
    isPending: boardPending,
    isSuccess: boardSuccess,
  } = useBoard({ id });

  // const data = useQueries({
  //   queries: [getBoardQueryOptions(id), getBoardStagesOptions(id)],
  // });

  if (boardPending) {
    return (
      <Spinner
        size="lg"
        className="h-96"
      />
    );
  }

  if (!boardSuccess || board.data.archived) {
    return <h1 className="">This board has been archived</h1>;
  }

  return (
    <AppContentLayout title={`Board ${id}`}>
      {/* TODO: Create AppContentHeader */}
      <div className="flex items-center min-h-[45px] px-2 border-border border-b">
        <h1 className="text-secondary text-sm font-bold">{board.data.name}</h1>
      </div>

      <BoardView boardId={id} />
    </AppContentLayout>
  );
};

export default Board;
