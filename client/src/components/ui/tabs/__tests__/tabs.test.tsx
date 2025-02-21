import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";

describe("Tabs", () => {
  const TestTabs = () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  );

  it("renders all tab components correctly", () => {
    render(<TestTabs />);
    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    // Content 2 is not immediately visible due to tab state
  });

  it("applies correct classes to TabsList", () => {
    render(<TestTabs />);
    const list = screen.getByRole("tablist");
    expect(list).toHaveClass("flex", "items-center");
  });

  it("applies correct classes to TabsTrigger", () => {
    render(<TestTabs />);
    const trigger = screen.getByRole("tab", { name: "Tab 1" });
    expect(trigger).toHaveClass(
      "inline-flex",
      "items-center",
      "font-semibold",
      "text-sm",
      "pb-[5px]",
      "cursor-pointer",
      "border-b-[2px]",
      "border-transparent"
    );
  });

  it("handles tab switching correctly", () => {
    render(<TestTabs />);
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });

    // Get all panels including hidden ones
    let tabPanels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(tabPanels[0]).toHaveAttribute("data-state", "active");
    expect(tabPanels[1]).toHaveAttribute("data-state", "inactive");

    // Click tab 2
    fireEvent.click(tab2);

    // Requery updated tab panels
    tabPanels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(tabPanels[0]).toHaveAttribute("data-state", "inactive");
    expect(tabPanels[1]).toHaveAttribute("data-state", "active");
  });

  it("applies active state classes to selected tab", () => {
    render(<TestTabs />);
    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    const tab2 = screen.getByRole("tab", { name: "Tab 2" });

    // Initial state
    expect(tab1).toHaveAttribute("data-state", "active");
    expect(tab2).toHaveAttribute("data-state", "inactive");

    // Click tab 2 and force a state update
    fireEvent.click(tab2);
    fireEvent.focus(tab2);

    // Now check the states are correct
    expect(tab2).toHaveAttribute("data-state", "active");
    expect(tab1).toHaveAttribute("data-state", "inactive");
  });

  it("forwards ref correctly for TabsList", () => {
    const ref = { current: null };
    render(
      <Tabs defaultValue="tab1">
        <TabsList ref={ref}>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className to TabsContent", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent
          value="tab1"
          className="custom-content"
        >
          Content 1
        </TabsContent>
      </Tabs>
    );
    const content = screen.getByText("Content 1");
    expect(content).toHaveClass("custom-content");
  });

  // New tests
  it("handles controlled value changes", () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    let tabPanels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(tabPanels[0]).toHaveAttribute("data-state", "active");
    expect(tabPanels[1]).toHaveAttribute("data-state", "inactive");

    // Change controlled value
    rerender(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    // Requery after rerender
    tabPanels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(tabPanels[0]).toHaveAttribute("data-state", "inactive");
    expect(tabPanels[1]).toHaveAttribute("data-state", "active");
  });

  it("maintains proper tab order in TabsList", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList aria-label="Tabs Example">
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
          <TabsTrigger value="tab3">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">First Content</TabsContent>
        <TabsContent value="tab2">Second Content</TabsContent>
        <TabsContent value="tab3">Third Content</TabsContent>
      </Tabs>
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveTextContent("First");
    expect(tabs[1]).toHaveTextContent("Second");
    expect(tabs[2]).toHaveTextContent("Third");
  });
});
