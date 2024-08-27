import React, { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@components/ui/dialog";
import { Form, Input } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { useCreateBoard } from "@features/boards/api/createBoard";
import { createBoardInputSchema } from "@types/board";

const CreateBoard = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const createBoard = useCreateBoard({
    onSuccess: () => {
      // TODO: Create board page for the navigation.
      // navigate(PathConstants.BOARD(data), {
      //  replace: true,
      // });
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[350px]">
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
        </DialogHeader>
        <Form
          className="py-5 px-4"
          onSubmit={(data) => {
            createBoard.mutate(data);
          }}
          schema={createBoardInputSchema}
        >
          {({ register }) => (
            <>
              <Input
                type="text"
                name="boardName"
                placeholder="Board Name e.g., Job Search Summer 2024"
                register={register("name")}
              />
              <Button
                type="submit"
                variant="default"
                className="w-full mt-2"
              >
                Create
              </Button>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoard;
