import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import * as RadixDialog from "@radix-ui/react-dialog";

import ConfirmationDialog from "../confirmation-dialog";
import { Button } from "../../../button";

// Mock ScrollArea
vi.mock("../../../scroll-area", () => ({
  ScrollArea: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

// Mock Radix Dialog
vi.mock("@radix-ui/react-dialog", () => {
  const createForwardRef = (Component: any) => {
    return vi.fn().mockImplementation(({ children, ...props }: any, ref: any) => (
      <Component
        {...props}
        ref={ref}
      >
        {children}
      </Component>
    ));
  };

  let dialogOpen = false;
  let onOpenChangeFn: ((open: boolean) => void) | null = null;

  const Root = ({ children, open, onOpenChange }: any) => {
    dialogOpen = open !== undefined ? open : dialogOpen;
    onOpenChangeFn = onOpenChange;
    return children;
  };

  const triggerClick = () => {
    dialogOpen = true;
    onOpenChangeFn?.(true);
  };

  const closeDialog = () => {
    dialogOpen = false;
    onOpenChangeFn?.(false);
  };

  return {
    Root,
    Trigger: createForwardRef(({ children, asChild, ...props }: any) => {
      const triggerProps = asChild ? children.props : {};
      return (
        <div
          onClick={triggerClick}
          {...triggerProps}
          {...props}
        >
          {children}
        </div>
      );
    }),
    Portal: ({ children }: any) => children,
    Overlay: createForwardRef(({ children, ...props }: any) =>
      dialogOpen ? (
        <div
          data-testid="dialog-overlay"
          {...props}
        >
          {children}
        </div>
      ) : null
    ),
    Content: createForwardRef(({ children, ...props }: any) =>
      dialogOpen ? (
        <div
          role="dialog"
          data-testid="dialog-content"
          {...props}
        >
          {children}
        </div>
      ) : null
    ),
    Title: createForwardRef(({ children, ...props }: any) => (
      <h2
        data-testid="dialog-title"
        {...props}
      >
        {children}
      </h2>
    )),
    Description: createForwardRef(({ children, ...props }: any) => (
      <p {...props}>{children}</p>
    )),
    Close: createForwardRef(({ children, ...props }: any) => (
      <button
        onClick={closeDialog}
        {...props}
      >
        {children}
      </button>
    )),
  };
});

describe("ConfirmationDialog Component", () => {
  const defaultProps = {
    title: "Confirm Action",
    description: "Are you sure you want to proceed?",
    triggerBtn: <Button>Open Dialog</Button>,
    actionBtn: <Button variant="destructive">Confirm</Button>,
  };

  it("renders with all props correctly", () => {
    render(<ConfirmationDialog {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("handles action button click correctly", () => {
    const onActionClick = vi.fn();
    render(
      <ConfirmationDialog
        {...defaultProps}
        actionBtn={<Button onClick={onActionClick}>Confirm</Button>}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onActionClick).toHaveBeenCalled();
  });

  it("uses custom cancel button text when provided", () => {
    render(
      <ConfirmationDialog
        {...defaultProps}
        cancelBtnText="Dismiss"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("prevents default event behavior on trigger button click", () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    };

    render(<ConfirmationDialog {...defaultProps} />);

    const triggerButton = screen.getByRole("button", { name: "Open Dialog" });
    // Directly call the onClick handler with mock event
    act(() => {
      triggerButton.onclick?.(mockEvent as any);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it("closes dialog when cancel button is clicked", () => {
    render(<ConfirmationDialog {...defaultProps} />);

    // Open dialog
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    });

    // Click cancel button
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });

    // Wait for state update
    act(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes dialog when isAsyncDone prop changes to true", () => {
    const { rerender } = render(
      <ConfirmationDialog
        {...defaultProps}
        isAsyncDone={false}
      />
    );

    // Open dialog
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Change isAsyncDone prop
    act(() => {
      rerender(
        <ConfirmationDialog
          {...defaultProps}
          isAsyncDone={true}
        />
      );
    });

    // Wait for state update
    act(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
