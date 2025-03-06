import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@utils/cn";

import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export type TextareaProps = {
  label?: string;
  register: UseFormRegisterReturn;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldWrapperPassThroughProps;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, required, register, children, ...props }, ref) => {
    return (
      <FieldWrapper
        label={label}
        required={required}
      >
        <div className="relative">
          <textarea
            role="textbox"
            data-testid="textarea"
            className={cn(
              "bg-background w-full text-[1rem] text-foreground/80 placeholder-foreground/50 px-3 py-2 border-border border-[1px] rounded-md autofill:bg-background min-h-[80px]",
              "hover:border-primary focus:border-primary focus:shadow-3xl focus:outline-none focus:ring-0 transition ease-out duration-150",
              className
            )}
            {...props}
            {...register}
            ref={(e) => {
              // Handle both react-hook-form and forwardRef refs
              if (typeof register.ref === "function") {
                register.ref(e);
              }
              if (ref) {
                if (typeof ref === "function") {
                  ref(e);
                } else {
                  ref.current = e;
                }
              }
            }}
          />
          {children}
        </div>
      </FieldWrapper>
    );
  }
);
