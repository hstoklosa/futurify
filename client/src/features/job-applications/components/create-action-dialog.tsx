import { useState } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Form, Input, Select, Textarea } from "@components/ui/form";
import { DateTimePicker } from "@components/ui/form/date-time-picker";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import ScrollArea from "@components/ui/scroll-area/scroll-area";

import { useCreateAction, ActionType } from "../api/actions";

const createActionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.nativeEnum(ActionType, {
    required_error: "Action type is required",
  }),
  startDateTime: z.date({
    required_error: "Start date and time is required",
  }),
  endDateTime: z.date({
    required_error: "End date and time is required",
  }),
  color: z.string().optional(),
  notes: z.string().optional(),
  completed: z.boolean().default(false),
});

type CreateActionDialogProps = {
  jobId: number;
  children: React.ReactNode;
};

const CreateActionDialog = ({ jobId, children }: CreateActionDialogProps) => {
  const [open, setOpen] = useState(false);

  const createAction = useCreateAction({
    onSuccess: () => setOpen(false),
  });

  const actionTypes = Object.entries(ActionType).map(([key, value]) => ({
    label: key
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" "),
    value,
  }));

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col max-h-[80vh] w-[480px] gap-0 p-0">
        <DialogHeader className="px-6 py-4">
          <DialogTitle>Add Action</DialogTitle>
        </DialogHeader>

        <Form
          onSubmit={(data) =>
            createAction.mutate({
              jobId,
              data: {
                ...data,
                startDateTime: data.startDateTime.toISOString(),
                endDateTime: data.endDateTime.toISOString(),
              },
            })
          }
          schema={createActionSchema}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {({ register, setValue, watch }) => (
            <>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(80vh-8.5rem)]">
                  <div className="space-y-4 py-4 px-6">
                    <Input
                      type="text"
                      className="text-[14px]"
                      label="Title"
                      placeholder="Action title"
                      register={register("title")}
                      required
                    />

                    <Select
                      label="Type"
                      options={actionTypes}
                      register={register("type")}
                      required
                      className="text-[14px]"
                      containerClassName="text-[14px]"
                    />

                    <div className="inline-flex w-full gap-2">
                      <DateTimePicker
                        label="Start Date"
                        value={watch("startDateTime")}
                        onChange={(date) => setValue("startDateTime", date)}
                        required
                        className="text-[14px]"
                        containerClassName="text-[14px] flex-1"
                      />

                      <DateTimePicker
                        label="End Date"
                        value={watch("endDateTime")}
                        onChange={(date) => setValue("endDateTime", date)}
                        required
                        className="text-[14px]"
                        containerClassName="text-[14px] flex-1"
                      />
                    </div>

                    <Input
                      type="color"
                      className="text-[14px] h-10"
                      label="Color"
                      register={register("color")}
                    />

                    <Textarea
                      className="text-[14px]"
                      label="Notes"
                      placeholder="Add notes"
                      register={register("notes")}
                    />

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="completed"
                        checked={watch("completed")}
                        onCheckedChange={(checked: boolean) =>
                          setValue("completed", checked)
                        }
                      />
                      <label
                        htmlFor="completed"
                        className="text-sm font-medium leading-none"
                      >
                        Mark as completed
                      </label>
                    </div>
                  </div>
                </ScrollArea>
              </div>

              <DialogFooter className="flex-shrink-0 px-6 py-4 border-t">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outlineMuted"
                    size="sm"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={createAction.isPending}
                  >
                    {createAction.isPending ? "Adding..." : "Add Action"}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActionDialog;
