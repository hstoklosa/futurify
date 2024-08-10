import { UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import { cn } from "@/utils/cn";

type InputProps = {
    label: string;
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
                        "bg-background px-3 py-2 w-full text-[1rem] text-primary-foreground/80 placeholder-primary-foreground/50 focus:border-primary focus:outline-none focus:ring-0 border-border border-2 rounded-md",
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