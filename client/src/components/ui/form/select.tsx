import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import { cn } from "@/utils/cn";

type Option = {
  label: string;
  value: string | number | string[];
};

type SelectProps = {
  register: Partial<UseFormRegisterReturn>;
  options: Option[];
  defaultValue?: string | number;
  className?: string;
} & FieldWrapperPassThroughProps &
  React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({
  label,
  className,
  options,
  defaultValue,
  register,
  required,
  ...props
}: SelectProps) => (
  <FieldWrapper
    label={label}
    required={required}
  >
    <select
      className={cn(
        "w-full text-base text-secondary px-3 py-2 border-border border-[1px] placeholder-foreground/50 hover:border-primary rounded-md cursor-pointer focus:outline-none focus:ring-primary focus:ring-1 truncate",
        className
      )}
      defaultValue={defaultValue}
      {...register}
      {...props}
    >
      {options.map((option) => (
        <option
          key={option.label}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  </FieldWrapper>
);

export default Select;
