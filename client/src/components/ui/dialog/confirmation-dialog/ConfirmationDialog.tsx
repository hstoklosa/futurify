import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../Dialog";
import { Button } from "../../button";

type ConfirmationDialogProps = {
  title: string;
  description?: string;
  actionBtn: React.ReactElement;
  triggerBtn: React.ReactElement;
  cancelBtnText?: string;
  isAsyncDone?: boolean;
};

const ConfirmationDialog = ({
  title,
  description = "",
  actionBtn,
  triggerBtn,
  cancelBtnText = "Cancel",
  isAsyncDone = false,
}: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAsyncDone) setOpen(false);
  }, [isAsyncDone]);

  const handleNavPrevention = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {React.cloneElement(triggerBtn, {
          onClick: (e: React.MouseEvent) => {
            handleNavPrevention(e);
            setOpen(true);
          },
        })}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {description && (
          <div className="p-4">
            <p className="text-sm text-foreground/60 text-center">{description}</p>
          </div>
        )}

        <DialogFooter className="h-12">
          {React.cloneElement(actionBtn, {
            className: "mr-2 h-8",
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              actionBtn.props.onClick?.(e);
              setOpen(false);
            },
          })}
          <Button
            variant="outline"
            className="w-auto h-8 border-border border-[1px]"
            onClick={(e: React.MouseEvent) => {
              handleNavPrevention(e);
              setOpen(false);
            }}
          >
            {cancelBtnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
