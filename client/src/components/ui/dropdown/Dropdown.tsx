import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@utils/cn";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, forwardRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={forwardRef}
        className={cn(
          "z-50 bg-background min-w-[8rem] rounded-md select-none shadow-lg border-border border-[1px]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 date-[state-closed]:animate-out data-[state=closed]:fade-out-0",
          className
        )}
        sideOffset={sideOffset}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "text-sm text-foreground/70 px-3 py-2 outline-none [&:not([data-disabled])]:cursor-pointer [&:not([data-disabled])]:hover:bg-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
});

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
