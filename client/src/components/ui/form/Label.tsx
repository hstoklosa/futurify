import { cva } from "class-variance-authority";
import { cn } from "@utils/cn";

const labelVariants = cva("text-foreground text-sm font-semibold mb-2");

type LabelProps = {
    label: string;
    className?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = ({ label, className, ...props }: LabelProps) => (
    <label
        className={cn(labelVariants(), className)}
        {...props}
    >
        {label}
    </label>
);

export default Label;
