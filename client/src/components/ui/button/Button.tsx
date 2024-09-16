import React, { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        outline: "border-primary border-2 text-foreground",
        outlineMuted:
          "bg-background border-border border-[1px] rounded-md shadow-4xl hover:border-foreground/20",
        ghost:
          "flex items-center text-sm text-foreground/80 font-semibold px-4 min-h-8 rounded-md hover:bg-secondary/5",
        // link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 py-[6px] px-4",
        sm: "h-7 rounded-md px-3 text-xs font-normal",
        // lg: "h-10 rounded-md px-8",
        // icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && <div className="mr-2">{icon}</div>}
        {children}
      </button>
    );
  }
);

export default Button;
