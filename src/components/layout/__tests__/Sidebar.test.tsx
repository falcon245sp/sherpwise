import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("@/lib/auth/hooks", () => ({
  useOntaraUser: () => ({
    user: {
      id: "test-user",
      email: "test@example.com",
      role: "SiteAdmin",
    },
    isLoaded: true,
  }),
  useHasRole: () => true,
}));

describe("Sidebar", () => {
  it("renders all navigation items", () => {
    render(<Sidebar isOpen={true} />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Standards")).toBeInTheDocument();
    expect(screen.getByText("Classify")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("hides when isOpen is false", () => {
    const { container } = render(<Sidebar isOpen={false} />);
    
    const sidebar = container.querySelector("aside");
    expect(sidebar).toHaveClass("-translate-x-full");
  });

  it("shows when isOpen is true", () => {
    const { container } = render(<Sidebar isOpen={true} />);
    
    const sidebar = container.querySelector("aside");
    expect(sidebar).toHaveClass("translate-x-0");
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    closeButton.click();
    
    expect(onClose).toHaveBeenCalledOnce();
  });
});
