import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none cursor-pointer disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-primary",
                outline: "border-primary border-2 text-primary-foreground",
                // ghost: "hover:bg-accent hover:text-accent-foreground",
                // link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 py-[6px] px-4",
                // sm: "h-8 rounded-md px-3 text-xs",
                // lg: "h-10 rounded-md px-8",
                // icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface IButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

const Button = ({ className, variant, size, children, ...rest }: IButtonProps) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;