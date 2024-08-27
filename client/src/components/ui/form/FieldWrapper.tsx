import { type FieldError } from "react-hook-form";
import { cva } from "class-variance-authority";

import { cn } from "@utils/cn";

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: FieldError | undefined;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  "className" | "children"
>;

const labelVariants = cva("text-foreground text-sm font-semibold mb-2");

export const FieldWrapper = ({
  label,
  error,
  className,
  children,
  ...props
}: FieldWrapperProps) => {
  return (
    <div>
      <label
        className={cn(labelVariants(), className)}
        {...props}
      >
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
};
