import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button">User Button</div>,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("Header", () => {
  it("renders the header with logo and navigation", () => {
    render(<Header />);
    
    expect(screen.getByText("Ontara")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Standards")).toBeInTheDocument();
    expect(screen.getByText("Classify")).toBeInTheDocument();
  });

  it("renders the user button", () => {
    render(<Header />);
    
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("renders menu button for mobile", () => {
    render(<Header />);
    
    expect(screen.getByText("Toggle menu")).toBeInTheDocument();
  });

  it("calls onMenuClick when menu button is clicked", () => {
    const onMenuClick = vi.fn();
    render(<Header onMenuClick={onMenuClick} />);
    
    const menuButton = screen.getByRole("button", { name: /toggle menu/i });
    menuButton.click();
    
    expect(onMenuClick).toHaveBeenCalledOnce();
  });
});
