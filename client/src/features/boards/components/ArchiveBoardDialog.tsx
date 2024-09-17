import { useQueryClient } from "@tanstack/react-query";
import { LuTrash } from "react-icons/lu";

import { Button } from "@components/ui/button";
import { ConfirmationDialog } from "@components/ui/dialog/confirmation-dialog";

import { useUpdateBoard } from "../api/updateBoard";

const ArchiveBoardDialog = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const updateBoardMutation = useUpdateBoard({
    onSuccess: (data) => {
      console.log(data);
      console.log("Board archived");
    },
  });

  return (
    <ConfirmationDialog
      title="Delete Board"
      description="Are you sure you want to delete this board? This action cannot be undone."
      triggerBtn={
        <Button
          variant="outlineMuted"
          className="text-foreground items-center justify-center w-5 h-5 p-1 hidden group-hover:flex"
        >
          <LuTrash className="stroke-foreground/50" />
        </Button>
      }
      actionBtn={
        <Button
          onClick={(e) => {
            e.preventDefault();
            updateBoardMutation.mutate({
              boardId: id,
              data: { archived: true },
            });
          }}
        >
          Delete
        </Button>
      }
      isAsyncDone={false}
    />
  );
};

export default ArchiveBoardDialog;
