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
      className={cn("relative h-full w-full", className)}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className={cn(
          "flex select-none touch-none transition-colors duration-150",
          "absolute right-0 top-0 z-50 h-full w-0.5",
          "hover:w-1 hover:bg-black/10"
        )}
      >
        <ScrollAreaPrimitive.Thumb
          className={cn(
            "relative flex-1 rounded-full bg-black/20",
            "before:absolute before:top-1/2 before:left-1/2",
            "before:-translate-x-1/2 before:-translate-y-1/2",
            "before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
          )}
        />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
};

export default ScrollArea;
