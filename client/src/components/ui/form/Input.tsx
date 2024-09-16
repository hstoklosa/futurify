import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/utils/cn";

import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";

type InputProps = {
  label?: string;
  register: UseFormRegisterReturn;
} & React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps;

const Input = ({ className, label, type, register, ...props }: InputProps) => {
  return (
    <div className="flex flex-col">
      <FieldWrapper label={label}>
        <input
          type={type}
          className={cn(
            "bg-background px-3 py-2 w-full text-[1rem] text-foreground/80 placeholder-foreground/50  border-border border-[1px] rounded-md autofill:bg-background focus:border-primary focus:shadow-3xl focus:outline-none focus:ring-0 transition ease-out duration-150",
            className
          )}
          {...register}
          {...props}
        />
      </FieldWrapper>
    </div>
  );
};

export default Input;
