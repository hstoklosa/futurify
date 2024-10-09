import { cn } from "@/utils/cn";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import React, { forwardRef } from "react";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ children, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className="flex items-center"
    {...props}
  >
    {children}
  </TabsPrimitive.List>
));

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center text-sm pb-[5px] cursor-pointer",
      "data-[state=active]:text-secondary data-[state=active]:border-secondary data-[state=active]:border-b-[2px] data-[state=active]:font-semibold data-[state=inactive]:text-foreground/70",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
));

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-4", className)}
    {...props}
  />
));

export { Tabs, TabsList, TabsTrigger, TabsContent };
