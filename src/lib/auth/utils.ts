import { auth, currentUser } from "@clerk/nextjs/server";
import { UserRole, type OntaraUser, type UserMetadata } from "./types";

/**
 * Get the current authenticated user with Ontara-specific metadata
 * Server-side only
 */
export async function getOntaraUser(): Promise<OntaraUser | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const metadata = user.publicMetadata as unknown as UserMetadata;

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || "",
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    role: metadata.role || UserRole.Teacher, // Default to Teacher if no role set
    districtId: metadata.districtId || "",
    siteIds: metadata.siteIds,
    subject: metadata.subject,
  };
}

/**
 * Get just the user ID (faster than getOntaraUser)
 * Server-side only
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication or throw an error
 * Server-side only
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

/**
 * Require specific role or throw an error
 * Server-side only
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<OntaraUser> {
  const user = await getOntaraUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  return user;
}
