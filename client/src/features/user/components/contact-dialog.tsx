import React, { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog/Dialog";
import { Form, Input } from "@components/ui/form";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { useSendContactMessage } from "../api";
import { contactSchema, ContactFormValues } from "../schemas/contact-schema";
import { FieldWrapper } from "@components/ui/form/FieldWrapper";

type ContactDialogProps = {
  triggerButton: React.ReactElement;
};

export const ContactDialog = ({ triggerButton }: ContactDialogProps) => {
  const [open, setOpen] = useState(false);

  const sendContactMutation = useSendContactMessage({
    onSuccess: () => {
      setOpen(false);
    },
  });

  const handleSubmit = (data: ContactFormValues) => {
    sendContactMutation.mutate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="w-[550px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        <div className="h-full">
          <ScrollArea>
            <div className="p-4">
              <p className="text-foreground/70 mb-4">
                Send a message to our team. We'll get back to you as soon as
                possible.
              </p>
              <Form
                schema={contactSchema}
                onSubmit={handleSubmit}
                options={{
                  defaultValues: {
                    title: "",
                    message: "",
                  },
                }}
              >
                {(methods) => (
                  <>
                    <div className="space-y-4 mb-6">
                      <Input
                        type="text"
                        className="text-[14px]"
                        label="Title"
                        register={methods.register("title")}
                        placeholder="Enter the title of your message"
                        error={methods.formState.errors.title}
                      />
                      <div>
                        <FieldWrapper
                          label="Message"
                          error={methods.formState.errors.message}
                        >
                          <textarea
                            className="bg-background w-full text-[14px] text-foreground/80 placeholder-foreground/50 px-3 py-2 border-border border-[1px] rounded-md min-h-[150px] hover:border-primary focus:border-primary focus:shadow-3xl focus:outline-none focus:ring-0 transition ease-out duration-150"
                            placeholder="Enter your message"
                            {...methods.register("message")}
                          />
                        </FieldWrapper>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        disabled={sendContactMutation.isPending}
                      >
                        {sendContactMutation.isPending
                          ? "Sending..."
                          : "Send Message"}
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

export default ContactDialog;
