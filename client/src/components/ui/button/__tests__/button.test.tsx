import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies default variant and size classes", () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary", "text-white", "h-9");
  });

  it("applies custom variant classes", () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-primary", "border-2", "text-foreground");
  });

  it("applies custom size classes", () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-xs", "h-7", "px-3");
  });

  it("renders with icon", () => {
    const icon = <span data-testid="test-icon">🔍</span>;
    render(<Button icon={icon}>With Icon</Button>);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon").parentElement).toHaveClass("mr-2");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByText("Clickable"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies disabled styles when disabled", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:opacity-80",
      "disabled:cursor-not-allowed"
    );
  });

  it("applies additional className prop", () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });
});
