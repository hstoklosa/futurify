import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@components/ui/dialog";
import { Form, Input } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { createBoardInputSchema } from "@/types/board";
import { PathConstants } from "@utils/constants";

import { useCreateBoard } from "../api/createBoard";

const CreateBoard = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const createBoardMutation = useCreateBoard({
    onSuccess: (data) => {
      // TODO: Create board page for the navigation.
      //   navigate(PathConstants.BOARD_VIEW(data.toString()), {
      //     replace: true,
      //   });
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
        </DialogHeader>
        <Form
          className="py-5 px-4"
          onSubmit={(data) => {
            createBoardMutation.mutate(data);
          }}
          schema={createBoardInputSchema}
        >
          {({ register }) => (
            <>
              <Input
                type="text"
                placeholder="Board Name e.g., Job Search Summer 2024"
                register={register("name")}
              />
              <Button
                type="submit"
                variant="default"
                className="w-full mt-2"
                disabled={createBoardMutation.isPending}
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
