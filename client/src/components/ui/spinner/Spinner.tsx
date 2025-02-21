import { cn } from "@utils/cn";

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const variants = {
  primary: "text-primary",
};

export type SpinnerProps = {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
};

const Spinner = ({
  size = "md",
  variant = "primary",
  className = "",
}: SpinnerProps) => {
  return (
    <div className={cn("flex justify-center items-center w-full", className)}>
      <svg
        role="status"
        aria-label="loading"
        data-testid="spinner"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", sizes[size], variants[variant])}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

export default Spinner;
