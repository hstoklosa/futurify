import React from "react";
import { useNavigate } from "react-router-dom";
import Button, { ButtonProps } from "./Button";

type LinkButtonProps = {
  to?: string;
  state?: object;
} & ButtonProps;

const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({ to, state, onClick, children, className, ...rest }, ref) => {
    const navigate = useNavigate();

    return (
      <Button
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick && onClick(e);
          to && navigate(to, state);
        }}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

export default LinkButton;
