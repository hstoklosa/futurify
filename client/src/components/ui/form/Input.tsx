import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@utils/cn";

import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";

export type InputProps = {
  label?: string;
  register: UseFormRegisterReturn;
} & React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, type, register, children, ...props }, ref) => {
    return (
      <FieldWrapper
        label={label}
        required={required}
      >
        <div className="relative">
          <input
            type={type}
            className={cn(
              "bg-background w-full text-[1rem] text-foreground/80 placeholder-foreground/50 px-3 py-2 border-border border-[1px] rounded-md autofill:bg-background",
              "hover:border-primary focus:border-primary focus:shadow-3xl focus:outline-none focus:ring-0 transition ease-out duration-150",
              className
            )}
            {...register}
            {...props}
            ref={ref}
          />

          {children}
        </div>
      </FieldWrapper>
    );
  }
);
