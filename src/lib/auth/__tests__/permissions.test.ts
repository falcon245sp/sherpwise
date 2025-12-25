import { describe, it, expect } from "vitest";
import {
  canManageDistrict,
  canManageSite,
  canManageTeachers,
  canViewAllStandards,
  canUploadDocuments,
  canManageUsers,
  canAccessAnalytics,
  isAdmin,
  hasAccessToSite,
} from "../permissions";
import { UserRole } from "../types";

describe("permissions", () => {
  describe("canManageDistrict", () => {
    it("should allow district admin", () => {
      expect(canManageDistrict(UserRole.DistrictAdmin)).toBe(true);
    });

    it("should not allow other roles", () => {
      expect(canManageDistrict(UserRole.SiteAdmin)).toBe(false);
      expect(canManageDistrict(UserRole.Teacher)).toBe(false);
    });
  });

  describe("canManageSite", () => {
    it("should allow district admin and site admin", () => {
      expect(canManageSite(UserRole.DistrictAdmin)).toBe(true);
      expect(canManageSite(UserRole.SiteAdmin)).toBe(true);
    });

    it("should not allow other roles", () => {
      expect(canManageSite(UserRole.Teacher)).toBe(false);
      expect(canManageSite(UserRole.StudentParent)).toBe(false);
    });
  });

  describe("canManageTeachers", () => {
    it("should allow district admin and site admin", () => {
      expect(canManageTeachers(UserRole.DistrictAdmin)).toBe(true);
      expect(canManageTeachers(UserRole.SiteAdmin)).toBe(true);
    });

    it("should not allow other roles", () => {
      expect(canManageTeachers(UserRole.Teacher)).toBe(false);
    });
  });

  describe("canViewAllStandards", () => {
    it("should allow all staff roles", () => {
      expect(canViewAllStandards(UserRole.DistrictAdmin)).toBe(true);
      expect(canViewAllStandards(UserRole.SiteAdmin)).toBe(true);
      expect(canViewAllStandards(UserRole.SubjectLead)).toBe(true);
      expect(canViewAllStandards(UserRole.Teacher)).toBe(true);
    });

    it("should not allow student/parent", () => {
      expect(canViewAllStandards(UserRole.StudentParent)).toBe(false);
    });
  });

  describe("canUploadDocuments", () => {
    it("should allow all staff roles", () => {
      expect(canUploadDocuments(UserRole.DistrictAdmin)).toBe(true);
      expect(canUploadDocuments(UserRole.SiteAdmin)).toBe(true);
      expect(canUploadDocuments(UserRole.SubjectLead)).toBe(true);
      expect(canUploadDocuments(UserRole.Teacher)).toBe(true);
    });

    it("should not allow student/parent", () => {
      expect(canUploadDocuments(UserRole.StudentParent)).toBe(false);
    });
  });

  describe("canManageUsers", () => {
    it("should allow admins", () => {
      expect(canManageUsers(UserRole.DistrictAdmin)).toBe(true);
      expect(canManageUsers(UserRole.SiteAdmin)).toBe(true);
    });

    it("should not allow other roles", () => {
      expect(canManageUsers(UserRole.Teacher)).toBe(false);
    });
  });

  describe("canAccessAnalytics", () => {
    it("should allow leadership roles", () => {
      expect(canAccessAnalytics(UserRole.DistrictAdmin)).toBe(true);
      expect(canAccessAnalytics(UserRole.SiteAdmin)).toBe(true);
      expect(canAccessAnalytics(UserRole.SubjectLead)).toBe(true);
    });

    it("should not allow teacher or student/parent", () => {
      expect(canAccessAnalytics(UserRole.Teacher)).toBe(false);
      expect(canAccessAnalytics(UserRole.StudentParent)).toBe(false);
    });
  });

  describe("isAdmin", () => {
    it("should identify admin roles", () => {
      expect(isAdmin(UserRole.DistrictAdmin)).toBe(true);
      expect(isAdmin(UserRole.SiteAdmin)).toBe(true);
    });

    it("should not identify other roles as admin", () => {
      expect(isAdmin(UserRole.Teacher)).toBe(false);
      expect(isAdmin(UserRole.SubjectLead)).toBe(false);
    });
  });

  describe("hasAccessToSite", () => {
    it("should allow district admin to access any site", () => {
      expect(hasAccessToSite(UserRole.DistrictAdmin, undefined, "site-1")).toBe(true);
      expect(hasAccessToSite(UserRole.DistrictAdmin, [], "site-1")).toBe(true);
    });

    it("should allow site admin to access their assigned sites", () => {
      expect(hasAccessToSite(UserRole.SiteAdmin, ["site-1", "site-2"], "site-1")).toBe(
        true,
      );
      expect(hasAccessToSite(UserRole.SiteAdmin, ["site-1", "site-2"], "site-3")).toBe(
        false,
      );
    });

    it("should not allow access without site assignment", () => {
      expect(hasAccessToSite(UserRole.SiteAdmin, undefined, "site-1")).toBe(false);
      expect(hasAccessToSite(UserRole.Teacher, [], "site-1")).toBe(false);
    });
  });
});
