import React from "react";
import ReactDatePicker from "react-datepicker";
import { UseFormRegisterReturn } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";

import { cn } from "@utils/cn";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export type DateTimePickerProps = {
  label?: string;
  value?: Date;
  onChange: (date: Date | null) => void;
  register?: Partial<UseFormRegisterReturn>;
} & Omit<React.ComponentProps<typeof ReactDatePicker>, "onChange" | "selected"> &
  FieldWrapperPassThroughProps;

export const DateTimePicker = React.forwardRef<
  ReactDatePicker | null,
  DateTimePickerProps
>(({ className, label, required, value, onChange, register, ...props }, ref) => {
  return (
    <FieldWrapper
      label={label}
      required={required}
    >
      <div className="relative">
        <ReactDatePicker
          ref={ref}
          selected={value}
          // @ts-expect-error - The type definitions for react-datepicker are incorrect
          onChange={onChange}
          showTimeSelect
          dateFormat="MM/dd/yyyy h:mm aa"
          className={cn(
            "bg-background w-full text-[1rem] text-foreground/80 placeholder-foreground/50 px-3 py-2 border-border border-[1px] rounded-md",
            "hover:border-primary focus:border-primary focus:shadow-3xl focus:outline-none focus:ring-0 transition ease-out duration-150",
            className
          )}
          wrapperClassName="w-full"
          calendarClassName="!bg-background !border-border !text-foreground/80 !rounded-md !border !shadow-lg"
          dayClassName={(d: Date) =>
            cn(
              "!rounded-md hover:!bg-primary/20 !text-foreground/80",
              d.getTime() === value?.getTime() && "!bg-primary !text-white"
            )
          }
          timeClassName={() =>
            "!text-foreground/80 hover:!bg-primary/20 !rounded-md"
          }
          timeIntervals={15}
          {...props}
          {...register}
        />
      </div>
    </FieldWrapper>
  );
});
