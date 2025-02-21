import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../Dropdown";

// Mock Radix Portal and Animation
vi.mock("@radix-ui/react-dropdown-menu", async () => {
  const actual = await vi.importActual("@radix-ui/react-dropdown-menu");
  return {
    ...(actual as typeof RadixDropdown),
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Content: ({ children, ...props }: any) => (
      <div
        role="menu"
        {...props}
      >
        {children}
      </div>
    ),
    Item: ({ children, ...props }: any) => (
      <div
        role="menuitem"
        {...props}
      >
        {children}
      </div>
    ),
  };
});

describe("Dropdown", () => {
  it("renders dropdown trigger button", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows content when trigger is clicked", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    const items = await screen.findAllByRole("menuitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Item 1");
    expect(items[1]).toHaveTextContent("Item 2");
  });

  it("handles click events on menu items", async () => {
    const handleClick = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleClick}>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    const menuItem = await screen.findByRole("menuitem");
    await act(async () => {
      fireEvent.click(menuItem);
    });

    expect(handleClick).toHaveBeenCalled();
  });

  it("applies custom className to content and items", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    const menu = await screen.findByRole("menu");
    const menuItem = await screen.findByRole("menuitem");

    expect(menu).toHaveClass("custom-content");
    expect(menuItem).toHaveClass("custom-item");
  });
});
