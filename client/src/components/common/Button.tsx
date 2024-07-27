import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
}

const Button = ({ children, variant = "primary", ...rest }: ButtonProps) => {
    const variantClasses = {
        primary: "bg-primary h-9 font-bold py-[6px] px-4 rounded-lg cursor-pointer",
        secondary:
            "border-primary border-2 h-9 text-primary-text font-bold py-[6px] px-4 rounded-lg cursor-pointer",
    };

    const appliedVariant = variantClasses[variant];

    return (
        <button
            {...rest}
            className={`${appliedVariant} ${rest.className || ""}`}
        >
            {children}
        </button>
    );
};

export default Button;
