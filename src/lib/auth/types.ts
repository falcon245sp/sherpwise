/**
 * User roles in the Ontara platform
 * Hierarchical structure:
 * - DistrictAdmin: Full access to district and all sites
 * - SiteAdmin: Access to specific site(s) and all teachers/students in that site
 * - SubjectLead: Access to subject-specific content across sites
 * - Teacher: Access to their own classes and students
 * - StudentParent: Read-only access to student progress
 */
export enum UserRole {
  DistrictAdmin = "district_admin",
  SiteAdmin = "site_admin",
  SubjectLead = "subject_lead",
  Teacher = "teacher",
  StudentParent = "student_parent",
}

/**
 * User metadata stored in Clerk
 */
export interface UserMetadata {
  role: UserRole;
  districtId: string;
  siteIds?: string[]; // For SiteAdmin and SubjectLead
  subject?: string; // For SubjectLead
}

/**
 * Extended user information
 */
export interface OntaraUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  districtId: string;
  siteIds?: string[];
  subject?: string;
}
