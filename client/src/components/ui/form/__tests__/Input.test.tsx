import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../input";
import { UseFormRegisterReturn } from "react-hook-form";

describe("Input", () => {
  const mockRegister: UseFormRegisterReturn = {
    onChange: vi.fn(),
    onBlur: vi.fn(),
    name: "test-input",
    ref: vi.fn(),
  };

  it("renders input with label correctly", () => {
    render(
      <Input
        label="Test Label"
        register={mockRegister}
        placeholder="Enter text"
      />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders input without label", () => {
    render(
      <Input
        register={mockRegister}
        placeholder="Enter text"
      />
    );

    expect(screen.queryByRole("label")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("shows required indicator when required prop is true", () => {
    render(
      <Input
        label="Required Field"
        required
        register={mockRegister}
      />
    );

    const label = screen.getByText("Required Field");
    expect(label.parentElement).toContainHTML("*");
  });

  it("applies default classes", () => {
    render(<Input register={mockRegister} />);

    const input = screen.getByTestId("input");
    expect(input).toHaveClass(
      "bg-background",
      "w-full",
      "text-[1rem]",
      "text-foreground/80",
      "placeholder-foreground/50",
      "px-3",
      "py-2",
      "border-border",
      "border-[1px]",
      "rounded-md",
      "autofill:bg-background"
    );
  });

  it("applies custom className", () => {
    render(
      <Input
        register={mockRegister}
        className="custom-class"
      />
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <Input
        ref={ref}
        register={mockRegister}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("renders children correctly", () => {
    render(
      <Input register={mockRegister}>
        <span data-testid="child-element">Child Content</span>
      </Input>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<Input register={mockRegister} />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(mockRegister.onChange).toHaveBeenCalled();
  });

  it("handles blur events", () => {
    render(<Input register={mockRegister} />);

    const input = screen.getByTestId("input");
    fireEvent.blur(input);

    expect(mockRegister.onBlur).toHaveBeenCalled();
  });

  it("passes through HTML input attributes", () => {
    render(
      <Input
        register={mockRegister}
        type="password"
        placeholder="Enter password"
        maxLength={10}
        disabled
      />
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("placeholder", "Enter password");
    expect(input).toHaveAttribute("maxLength", "10");
    expect(input).toBeDisabled();
  });

  it("wraps input in FieldWrapper with correct structure", () => {
    render(
      <Input
        label="Field Label"
        register={mockRegister}
      />
    );

    const wrapper = screen.getByText("Field Label").closest("div");
    expect(wrapper).toHaveClass("w-full");

    const inputWrapper = screen.getByTestId("input").closest("div");
    expect(inputWrapper).toHaveClass("relative");
  });
});
