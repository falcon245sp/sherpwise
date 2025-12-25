import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppLayout } from "../AppLayout";

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div>User Button</div>,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("@/lib/auth/hooks", () => ({
  useOntaraUser: () => ({
    user: null,
    isLoaded: true,
  }),
  useHasRole: () => false,
}));

describe("AppLayout", () => {
  it("renders header, sidebar, and footer", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );
    
    expect(screen.getAllByText("Ontara").length).toBeGreaterThan(0);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders children in main content area", () => {
    render(
      <AppLayout>
        <h1>Dashboard Page</h1>
      </AppLayout>
    );
    
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });
});
