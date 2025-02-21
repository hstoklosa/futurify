import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../tooltip";

// Mock RadixUI Tooltip components
vi.mock("@radix-ui/react-tooltip", () => {
  return {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Root: ({
      children,
      defaultOpen,
    }: {
      children: React.ReactNode;
      defaultOpen?: boolean;
    }) => {
      const [isOpen, setIsOpen] = useState(defaultOpen || false);
      return (
        <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
          {children}
        </TooltipContext.Provider>
      );
    },
    Trigger: ({ children }: { children: React.ReactNode }) => {
      const { setIsOpen } = React.useContext(TooltipContext);
      return (
        <span
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </span>
      );
    },
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Content: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => {
      const { isOpen } = React.useContext(TooltipContext);
      return isOpen ? (
        <div
          data-testid="tooltip-content"
          className={className}
        >
          {children}
        </div>
      ) : null;
    },
  };
});

// Create a context for managing tooltip state
const TooltipContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

describe("Tooltip Component", () => {
  const renderTooltip = (content: string = "Tooltip content") => {
    return render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>{content}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  it("renders trigger element correctly", () => {
    renderTooltip();
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip content on hover", async () => {
    renderTooltip();
    const trigger = screen.getByText("Hover me");

    // Simulate hover
    fireEvent.mouseEnter(trigger);
    expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    // Simulate mouse leave
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByTestId("tooltip-content")).not.toBeInTheDocument();
  });

  it("applies custom className to tooltip content", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-class">Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const tooltipContent = screen.getByTestId("tooltip-content");
    expect(tooltipContent).toHaveClass("custom-class");
  });

  it("renders custom trigger element", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <button>Custom Button</button>
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Custom Button")).toBeInTheDocument();
  });
});
