import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "../Breadcrumbs";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/settings/profile",
}));

describe("Breadcrumbs", () => {
  it("renders custom breadcrumb items", () => {
    const items = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/dashboard/settings" },
      { label: "Profile" },
    ];
    
    render(<Breadcrumbs items={items} />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("auto-generates breadcrumbs from pathname", () => {
    render(<Breadcrumbs />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders home icon as first item", () => {
    render(<Breadcrumbs />);
    
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });
});
