import { UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import { cn } from "@/utils/cn";

type InputProps = {
  label?: string;
  register: UseFormRegisterReturn;
} & React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps;

const Input = ({ className, name, label, type, register, ...rest }: InputProps) => {
  return (
    <div className="flex flex-col">
      <FieldWrapper label={label}>
        <input
          id={name}
          type={type}
          className={cn(
            "bg-background px-3 py-2 w-full text-[1rem] text-foreground/80 placeholder-foreground/50  border-border border-[1px] rounded-md autofill:bg-background focus:border-primary focus:shadow-3xl focus:outline-none focus:ring-0 transition ease-out duration-150",
            className
          )}
          {...register}
          {...rest}
        />
      </FieldWrapper>
    </div>
  );
};

export default Input;
