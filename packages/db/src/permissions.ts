// Role hierarchy and permission helpers for Kaitif
// Role order: USER < ADMIN < SUPERADMIN

import type { UserRole } from "./types";

/**
 * Role hierarchy values - higher number = more permissions
 */
export const ROLE_HIERARCHY = {
  USER: 0,
  ADMIN: 1,
  SUPERADMIN: 2,
} as const;

export type RoleHierarchyKey = keyof typeof ROLE_HIERARCHY;

/**
 * Check if a role has at least the minimum required role level
 */
export function hasMinimumRole(
  userRole: UserRole | string,
  requiredRole: UserRole | string
): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as RoleHierarchyKey] ?? -1;
  const requiredLevel = ROLE_HIERARCHY[requiredRole as RoleHierarchyKey] ?? 999;
  return userLevel >= requiredLevel;
}

/**
 * Check if the current user can manage the target user's role
 * A user can only manage roles lower than their own
 */
export function canManageRole(
  currentRole: UserRole | string,
  targetRole: UserRole | string
): boolean {
  const currentLevel = ROLE_HIERARCHY[currentRole as RoleHierarchyKey] ?? -1;
  const targetLevel = ROLE_HIERARCHY[targetRole as RoleHierarchyKey] ?? 999;
  return currentLevel > targetLevel;
}

/**
 * Check if a user can assign a specific role
 * - ADMIN can only assign USER role
 * - SUPERADMIN can assign USER or ADMIN roles
 * - Nobody can assign SUPERADMIN via UI
 */
export function canAssignRole(
  currentRole: UserRole | string,
  roleToAssign: UserRole | string
): boolean {
  if (roleToAssign === "SUPERADMIN") {
    return false; // SUPERADMIN can only be set via database
  }

  if (currentRole === "SUPERADMIN") {
    return roleToAssign === "USER" || roleToAssign === "ADMIN";
  }

  if (currentRole === "ADMIN") {
    return roleToAssign === "USER";
  }

  return false;
}

/**
 * Check if user is an admin (ADMIN or SUPERADMIN)
 */
export function isAdmin(role: UserRole | string): boolean {
  return role === "ADMIN" || role === "SUPERADMIN";
}

/**
 * Check if user is a superadmin
 */
export function isSuperAdmin(role: UserRole | string): boolean {
  return role === "SUPERADMIN";
}

/**
 * Get the roles that a user with the given role can invite
 */
export function getInvitableRoles(currentRole: UserRole | string): UserRole[] {
  if (currentRole === "SUPERADMIN") {
    return ["USER", "ADMIN"];
  }
  if (currentRole === "ADMIN") {
    return ["USER"];
  }
  return [];
}

/**
 * Get display name for a role
 */
export function getRoleDisplayName(role: UserRole | string): string {
  switch (role) {
    case "USER":
      return "User";
    case "ADMIN":
      return "Admin";
    case "SUPERADMIN":
      return "Super Admin";
    default:
      return role;
  }
}

/**
 * Get badge color variant for a role (for UI)
 */
export function getRoleBadgeVariant(
  role: UserRole | string
): "secondary" | "accent" | "destructive" {
  switch (role) {
    case "SUPERADMIN":
      return "destructive";
    case "ADMIN":
      return "accent";
    default:
      return "secondary";
  }
}

/**
 * Validate that a role transition is allowed
 */
export function isValidRoleTransition(
  performerRole: UserRole | string,
  targetCurrentRole: UserRole | string,
  targetNewRole: UserRole | string
): { valid: boolean; error?: string } {
  // Can't change SUPERADMIN roles via UI
  if (targetCurrentRole === "SUPERADMIN") {
    return { valid: false, error: "Cannot modify SUPERADMIN roles via UI" };
  }

  // Can't promote to SUPERADMIN via UI
  if (targetNewRole === "SUPERADMIN") {
    return { valid: false, error: "Cannot assign SUPERADMIN role via UI" };
  }

  // Only SUPERADMIN can change roles
  if (performerRole !== "SUPERADMIN") {
    return { valid: false, error: "Only SUPERADMIN can change user roles" };
  }

  // Validate the target role can be assigned
  if (!canAssignRole(performerRole, targetNewRole)) {
    return { valid: false, error: `Cannot assign ${targetNewRole} role` };
  }

  return { valid: true };
}
