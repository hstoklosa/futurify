import React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@utils/cn";

const ScrollArea = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <ScrollAreaPrimitive.Root
      type="always"
      className={cn("relative size-full px-2.5", className)}
    >
      <ScrollAreaPrimitive.Viewport className="size-full w-[calc(100%)]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className={cn(
          "flex touch-none select-none rounded-md m-1",
          "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-1"
        )}
      >
        <ScrollAreaPrimitive.Thumb
          className={cn(
            "flex-1 rounded-[10px] bg-[#CFCBDA]",
            "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-full before:min-w-[11px] before:min-h-[11px]"
          )}
        />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
};

export default ScrollArea;
