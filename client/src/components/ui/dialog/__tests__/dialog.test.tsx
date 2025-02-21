import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as RadixDialog from "@radix-ui/react-dialog";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../Dialog";

// Mock ScrollArea as a simple div wrapper
vi.mock("../scroll-area", () => ({
  ScrollArea: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

// Mock Radix Dialog components
vi.mock("@radix-ui/react-dialog", async () => {
  const actual = await vi.importActual("@radix-ui/react-dialog");
  return {
    ...(actual as typeof RadixDialog),
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Overlay: ({ children, ...props }: any) => (
      <div
        data-testid="dialog-overlay"
        {...props}
      >
        {children}
      </div>
    ),
    Content: ({ children, ...props }: any) => (
      <div
        role="dialog"
        data-testid="dialog-content"
        {...props}
      >
        {children}
      </div>
    ),
    Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  };
});

describe("Dialog Component", () => {
  it("renders dialog with trigger and content", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <div>Dialog content</div>
          <DialogFooter>
            <button>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("applies custom className to components", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle className="custom-title">Test Dialog</DialogTitle>
          </DialogHeader>
          <DialogFooter className="custom-footer">
            <button>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("dialog")).toHaveClass("custom-content");
    expect(screen.getByText("Test Dialog").parentElement).toHaveClass(
      "custom-header"
    );
    expect(screen.getByRole("heading")).toHaveClass("custom-title");
    expect(screen.getByText("Close").parentElement).toHaveClass("custom-footer");
  });

  it("handles dialog state changes", () => {
    const onOpenChange = vi.fn();

    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    fireEvent.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
