import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScrollArea from "../scroll-area";

describe("ScrollArea", () => {
  it("renders children correctly", () => {
    render(
      <ScrollArea>
        <div data-testid="scroll-content">Scroll content</div>
      </ScrollArea>
    );

    expect(screen.getByTestId("scroll-content")).toBeInTheDocument();
  });

  it("applies default classes to root element", () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );

    const root = screen.getByTestId("scroll-area-root");
    expect(root).toHaveClass("relative", "size-full", "px-2.5");
  });

  it("applies custom className to root element", () => {
    render(
      <ScrollArea className="custom-class">
        <div>Content</div>
      </ScrollArea>
    );

    const root = screen.getByTestId("scroll-area-root");
    expect(root).toHaveClass("custom-class");
  });

  it("renders viewport with correct classes", () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );

    const viewport = document.querySelector("[data-radix-scroll-area-viewport]");
    expect(viewport).toHaveClass("size-full", "w-[calc(100%)]");
  });

  it("renders vertical scrollbar with correct classes", () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );

    const scrollbar = document.querySelector('[data-orientation="vertical"]');
    expect(scrollbar).toHaveClass(
      "flex",
      "touch-none",
      "select-none",
      "rounded-md",
      "m-1",
      "data-[orientation=vertical]:w-1"
    );
  });

  it("renders thumb with correct classes", async () => {
    render(
      <div style={{ height: "200px", width: "200px" }}>
        <ScrollArea>
          <div style={{ height: "1000px" }}>Tall content to force scrolling</div>
        </ScrollArea>
      </div>
    );

    // Wait for the thumb to appear
    const thumb = await screen.findByTestId("scroll-area-thumb");
    expect(thumb).toBeInTheDocument();
    expect(thumb).toHaveClass("flex-1", "rounded-[10px]", "bg-[#CFCBDA]");
  });

  it('renders with type="always"', () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    );

    const root = document.querySelector("[data-radix-scroll-area-root]");
    expect(root).toHaveAttribute("data-type", "always");
  });

  it("renders with long content", () => {
    const longContent = Array(20)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          data-testid={`item-${i}`}
        >
          Item {i + 1}
        </div>
      ));

    render(
      <ScrollArea>
        <div>{longContent}</div>
      </ScrollArea>
    );

    // Verify all items are rendered
    longContent.forEach((_, i) => {
      expect(screen.getByTestId(`item-${i}`)).toBeInTheDocument();
    });
  });

  it("renders nested content correctly", () => {
    render(
      <ScrollArea>
        <div data-testid="parent">
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </div>
      </ScrollArea>
    );

    expect(screen.getByTestId("parent")).toBeInTheDocument();
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  it("maintains correct structure with empty content", () => {
    render(
      <ScrollArea>
        <div data-testid="empty"></div>
      </ScrollArea>
    );

    expect(screen.getByTestId("empty")).toBeInTheDocument();
    expect(
      document.querySelector("[data-radix-scroll-area-viewport]")
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-orientation="vertical"]')
    ).toBeInTheDocument();
  });
});
