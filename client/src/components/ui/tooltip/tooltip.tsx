import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@utils/cn";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = ({
  children,
  ...props
}: TooltipPrimitive.TooltipTriggerProps) => {
  return (
    <TooltipPrimitive.Trigger
      asChild
      {...props}
    >
      <span>{children}</span>
    </TooltipPrimitive.Trigger>
  );
};

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <TooltipPortal>
      <TooltipPrimitive.Content
        ref={ref}
        className={cn(
          "z-50 bg-background border-border border-[1px] shadow-4xl text-foreground/50 text-sm px-4 py-1 rounded-md",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPortal>
  );
});

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
