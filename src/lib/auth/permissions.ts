import { UserRole } from "./types";

/**
 * Permission checks for different user roles
 */

export function canManageDistrict(role: UserRole): boolean {
  return role === UserRole.DistrictAdmin;
}

export function canManageSite(role: UserRole): boolean {
  return [UserRole.DistrictAdmin, UserRole.SiteAdmin].includes(role);
}

export function canManageTeachers(role: UserRole): boolean {
  return [UserRole.DistrictAdmin, UserRole.SiteAdmin].includes(role);
}

export function canViewAllStandards(role: UserRole): boolean {
  return [
    UserRole.DistrictAdmin,
    UserRole.SiteAdmin,
    UserRole.SubjectLead,
    UserRole.Teacher,
  ].includes(role);
}

export function canUploadDocuments(role: UserRole): boolean {
  return [
    UserRole.DistrictAdmin,
    UserRole.SiteAdmin,
    UserRole.SubjectLead,
    UserRole.Teacher,
  ].includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return [UserRole.DistrictAdmin, UserRole.SiteAdmin].includes(role);
}

export function canAccessAnalytics(role: UserRole): boolean {
  return [UserRole.DistrictAdmin, UserRole.SiteAdmin, UserRole.SubjectLead].includes(role);
}

export function isAdmin(role: UserRole): boolean {
  return [UserRole.DistrictAdmin, UserRole.SiteAdmin].includes(role);
}

/**
 * Check if a user has access to a specific site
 */
export function hasAccessToSite(
  role: UserRole,
  userSiteIds: string[] | undefined,
  targetSiteId: string,
): boolean {
  // District admins have access to all sites
  if (role === UserRole.DistrictAdmin) {
    return true;
  }

  // Site admins and subject leads only have access to their assigned sites
  if (userSiteIds && userSiteIds.includes(targetSiteId)) {
    return true;
  }

  return false;
}
