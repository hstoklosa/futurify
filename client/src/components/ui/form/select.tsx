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
  ...props
}: SelectProps) => (
  <FieldWrapper label={label}>
    <select
      className={cn(
        "w-full text-secondary text-base border-border border-[1px] hover:border-primary rounded-md cursor-pointer focus:border-foreground focus:outline-none focus:ring-foreground truncate",
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
