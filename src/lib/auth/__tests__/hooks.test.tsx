import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useOntaraUser, useHasRole } from "../hooks";
import { UserRole } from "../types";

// Mock @clerk/nextjs
vi.mock("@clerk/nextjs", () => ({
  useUser: vi.fn(),
}));

import { useUser } from "@clerk/nextjs";

describe("auth hooks", () => {
  describe("useOntaraUser", () => {
    it("should return null when not loaded", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoaded: false,
        user: null,
        isSignedIn: false,
      } as never);

      const { result } = renderHook(() => useOntaraUser());

      expect(result.current.user).toBeNull();
      expect(result.current.isLoaded).toBe(false);
    });

    it("should return null when no user", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoaded: true,
        user: null,
        isSignedIn: false,
      } as never);

      const { result } = renderHook(() => useOntaraUser());

      expect(result.current.user).toBeNull();
      expect(result.current.isLoaded).toBe(true);
    });

    it("should return user with metadata", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        user: {
          id: "user-123",
          emailAddresses: [{ emailAddress: "test@example.com" }],
          firstName: "John",
          lastName: "Doe",
          publicMetadata: {
            role: UserRole.Teacher,
            districtId: "district-1",
            siteIds: ["site-1"],
          },
        },
      } as never);

      const { result } = renderHook(() => useOntaraUser());

      expect(result.current.user).toEqual({
        id: "user-123",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        role: UserRole.Teacher,
        districtId: "district-1",
        siteIds: ["site-1"],
        subject: undefined,
      });
      expect(result.current.isLoaded).toBe(true);
    });

    it("should default to Teacher role if no role in metadata", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        user: {
          id: "user-123",
          emailAddresses: [{ emailAddress: "test@example.com" }],
          firstName: "Jane",
          lastName: "Smith",
          publicMetadata: {
            districtId: "district-1",
          },
        },
      } as never);

      const { result } = renderHook(() => useOntaraUser());

      expect(result.current.user?.role).toBe(UserRole.Teacher);
    });
  });

  describe("useHasRole", () => {
    it("should return true when user has allowed role", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        user: {
          id: "user-123",
          emailAddresses: [{ emailAddress: "admin@example.com" }],
          firstName: "Admin",
          lastName: "User",
          publicMetadata: {
            role: UserRole.DistrictAdmin,
            districtId: "district-1",
          },
        },
      } as never);

      const { result } = renderHook(() =>
        useHasRole([UserRole.DistrictAdmin, UserRole.SiteAdmin]),
      );

      expect(result.current).toBe(true);
    });

    it("should return false when user does not have allowed role", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        user: {
          id: "user-123",
          emailAddresses: [{ emailAddress: "teacher@example.com" }],
          firstName: "Teacher",
          lastName: "User",
          publicMetadata: {
            role: UserRole.Teacher,
            districtId: "district-1",
          },
        },
      } as never);

      const { result } = renderHook(() =>
        useHasRole([UserRole.DistrictAdmin, UserRole.SiteAdmin]),
      );

      expect(result.current).toBe(false);
    });

    it("should return false when no user", () => {
      vi.mocked(useUser).mockReturnValue({
        isLoaded: true,
        user: null,
        isSignedIn: false,
      } as never);

      const { result } = renderHook(() => useHasRole([UserRole.Teacher]));

      expect(result.current).toBe(false);
    });
  });
});
