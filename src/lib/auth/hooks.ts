"use client";

import { useUser } from "@clerk/nextjs";
import { UserRole, type OntaraUser, type UserMetadata } from "./types";

/**
 * Custom hook to get Ontara user with role information
 * Client-side only
 */
export function useOntaraUser(): {
  user: OntaraUser | null;
  isLoaded: boolean;
} {
  const { user: clerkUser, isLoaded } = useUser();

  if (!isLoaded || !clerkUser) {
    return { user: null, isLoaded };
  }

  const metadata = clerkUser.publicMetadata as unknown as UserMetadata;

  const user: OntaraUser = {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || "",
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    role: metadata.role || UserRole.Teacher,
    districtId: metadata.districtId || "",
    siteIds: metadata.siteIds,
    subject: metadata.subject,
  };

  return { user, isLoaded: true };
}

/**
 * Hook to check if user has a specific role
 * Client-side only
 */
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const { user } = useOntaraUser();
  return user ? allowedRoles.includes(user.role) : false;
}
