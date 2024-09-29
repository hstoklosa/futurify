import { type FieldError } from "react-hook-form";
import { cva } from "class-variance-authority";

import { cn } from "@utils/cn";

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: FieldError;
  required?: boolean;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  "className" | "children"
>;

const labelVariants = cva("text-foreground text-sm font-semibold mb-2");

export const FieldWrapper = ({
  label,
  required,
  className,
  children,
  ...props
}: FieldWrapperProps) => {
  return (
    <div className="w-full">
      <label
        className={cn(labelVariants(), className)}
        {...props}
      >
        {label} {required && <span className="text-foreground/80">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
};
