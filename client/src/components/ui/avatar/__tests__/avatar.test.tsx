import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "../Avatar";

describe("Avatar", () => {
  it("renders without crashing", () => {
    render(<Avatar />);
    expect(screen.getByTestId("avatar-root")).toBeInTheDocument();
  });

  it("renders with image when src is provided", () => {
    const testSrc = "https://example.com/avatar.jpg";
    const testAlt = "Test Avatar";
    render(
      <Avatar
        src={testSrc}
        alt={testAlt}
      />
    );

    const image = screen.getByTestId("avatar-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", testSrc);
    expect(image).toHaveAttribute("alt", testAlt);
  });

  it("applies custom className correctly", () => {
    const customClass = "test-class";
    render(<Avatar className={customClass} />);

    const avatarRoot = screen.getByTestId("avatar-root");
    expect(avatarRoot).toHaveClass(customClass);
  });

  it("shows fallback when no src is provided", () => {
    render(<Avatar />);
    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).toBeInTheDocument();
  });

  it("does not show image element when no src is provided", () => {
    render(<Avatar />);
    const image = screen.queryByTestId("avatar-image");
    expect(image).not.toBeInTheDocument();
  });
});
