import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Dialog, DialogTrigger, DialogContent } from "@components/ui/dialog/Dialog";
import { Form, Input } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { USER_KEY } from "@utils/constants";
import { User } from "@/types/api";
import { useUpdateUser, UpdateUserInput } from "../api";
import { userDetailsSchema, UserFormValues } from "../schemas/user-schemas";

type SettingsDialogProps = {
  triggerButton: React.ReactElement;
};

interface ExtendedUser extends User {
  dailyApplicationGoal?: number;
}

export const SettingsDialog = ({ triggerButton }: SettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<{ data: ExtendedUser }>(USER_KEY);
  const user = userData?.data;

  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const handleSubmit = (data: UserFormValues) => {
    // Create a new object with only the non-empty values
    const updateData: UpdateUserInput = {};

    if (data.firstName !== undefined && data.firstName !== "") {
      updateData.firstName = data.firstName;
    }

    if (data.lastName !== undefined && data.lastName !== "") {
      updateData.lastName = data.lastName;
    }

    if (data.password !== undefined && data.password !== "") {
      updateData.password = data.password;
    }

    if (data.dailyApplicationGoal !== undefined) {
      updateData.dailyApplicationGoal = data.dailyApplicationGoal;
    }

    // Only submit if there are changes
    if (Object.keys(updateData).length > 0) {
      updateUserMutation.mutate(updateData);
    }
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-[550px] max-w-[95vw]">
        <div className="h-full">
          <ScrollArea>
            <div className="p-4">
              <Form
                schema={userDetailsSchema}
                onSubmit={handleSubmit}
                options={{
                  defaultValues: {
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    password: "",
                    passwordConfirmation: "",
                    dailyApplicationGoal: user.dailyApplicationGoal || 5,
                  },
                }}
              >
                {(methods) => (
                  <>
                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-bold text-foreground/80 tracking-wide border-b border-border pb-2">
                        Personal Information
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Input
                            type="text"
                            className="text-[14px]"
                            label="First Name"
                            register={methods.register("firstName")}
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            type="text"
                            className="text-[14px]"
                            label="Last Name"
                            register={methods.register("lastName")}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                      <Input
                        type="password"
                        className="text-[14px]"
                        label="Password"
                        register={methods.register("password")}
                        placeholder="Enter new password"
                      />
                      <Input
                        type="password"
                        className="text-[14px]"
                        label="Confirm Password"
                        register={methods.register("passwordConfirmation")}
                        placeholder="Confirm new password"
                        error={methods.formState.errors.passwordConfirmation}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-foreground/80 tracking-wide border-b border-border pb-2">
                        Application Settings
                      </h3>
                      <div className="w-full sm:w-1/2">
                        <Input
                          type="number"
                          className="text-[14px]"
                          label="Daily Application Goal"
                          register={methods.register("dailyApplicationGoal", {
                            valueAsNumber: true,
                          })}
                          placeholder="Enter your daily goal"
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        disabled={updateUserMutation.isPending}
                      >
                        {updateUserMutation.isPending
                          ? "Saving..."
                          : "Save Changes"}
                      </Button>
                      <Button
                        variant="outlineMuted"
                        size="sm"
                        onClick={() => setOpen(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
