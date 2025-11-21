/**
 * Admin Role Check Hook
 * Verifies if the current user has admin privileges
 */

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

const ROLE_IDS = {
  User: 1,
  Admin: 2,
  Organization: 3,
  MemberOfOrganization: 4,
} as const;

export function useAdminCheck() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Check if user exists and has roles
    if (!user || !user.roles || user.roles.length === 0) {
      console.warn("⚠️ No user or roles found, redirecting to home");
      router.push("/");
      return;
    }

    // Check if user has Admin role
    const hasAdminRole = user.roles.some(
      (userRole) => userRole.role.roleId === ROLE_IDS.Admin
    );

    if (!hasAdminRole) {
      console.warn("⚠️ User does not have admin role, redirecting to home");
      router.push("/");
      return;
    }

    console.log("✅ Admin access granted for user:", user.userId);
    setIsAdmin(true);
    setChecking(false);
  }, [user, isLoading, router]);

  return {
    isAdmin,
    checking: checking || isLoading,
    user,
  };
}
