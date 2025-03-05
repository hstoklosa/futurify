import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Form, Input, Select, TextEditor } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { renderOptions } from "@utils/select";
import { enumToArray } from "@utils/format";
import { ScrollArea } from "@components/ui/scroll-area";

import { JobType, createJobSchema } from "@schemas/job-application";
import { useActiveBoards } from "@/features/boards/api/get-active-boards";
import { useBoardStages } from "@/features/boards/api/get-board-stages";
import { useCreateJob } from "../api/create-job";

type CreateJobDialogProps = {
  boardId: string;
  stageId: number;
  children: React.ReactNode;
};

const CreateJobDialog = ({ boardId, stageId, children }: CreateJobDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: boards } = useActiveBoards({});
  const { data: stages } = useBoardStages({ id: boardId });

  const createJob = useCreateJob({
    onSuccess: () => setOpen(false),
  });

  if (!boards || !stages) {
    return <div />;
  }

  const jobTypes = enumToArray(JobType);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[420px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>
        <Form
          onSubmit={(data) =>
            createJob.mutate({
              boardId: Number(data.boardId),
              data,
            })
          }
          schema={createJobSchema}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {({ register, control }) => (
            <>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(85vh-130px)]">
                  <div className="space-y-4 py-5 px-4">
                    <Input
                      type="text"
                      className="text-[14px]"
                      label="Job Title"
                      placeholder="Job Title"
                      register={register("title")}
                      required
                    />

                    <Input
                      type="text"
                      className="text-[14px]"
                      label="Company Name"
                      placeholder="Company Name"
                      register={register("companyName")}
                      required
                    />

                    <div className="inline-flex w-full gap-2">
                      <Input
                        type="text"
                        className="text-[14px] flex-grow"
                        label="Location"
                        placeholder="Location"
                        register={register("location")}
                        required
                      />

                      <Select
                        label="Type"
                        className="text-[14px] h-[38.33px]"
                        defaultValue={undefined}
                        options={renderOptions(jobTypes, "value", "key")}
                        register={register("type")}
                        required
                      />
                    </div>

                    <TextEditor
                      control={control}
                      name="description"
                      label="Job Description"
                      defaultValue=""
                    />

                    <div className="inline-flex w-full gap-2">
                      <Select
                        label="Board"
                        className="p-1.5 text-[14px]"
                        defaultValue={boardId}
                        options={renderOptions(boards.data, "name", "id")}
                        register={register("boardId")}
                        required
                      />
                      <Select
                        label="Stage"
                        className="p-1.5 text-[14px]"
                        defaultValue={stageId.toString()}
                        options={renderOptions(stages.data, "name", "id")}
                        register={register("stageId")}
                        required
                      />
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <DialogFooter className="justify-end px-3 space-x-2 border-none mt-4">
                <Button
                  variant="outlineMuted"
                  size="sm"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={createJob.isPending}
                >
                  {createJob.isPending ? "Adding..." : "Add"}
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobDialog;
