import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { UserRole } from "prisma/types/userrole";
import { currentUserIdAtom } from "./currentUserIdAtom";

// Asynchrones Atom für UserRole
export const userRoleAtom = atomWithQuery<UserRole | null>((get) => {
  const userId = get(currentUserIdAtom);
  return {
    queryKey: ["userRole", userId],
    queryFn: async () => {
      if (userId) {
        try {
          const userRole = await agent.userRoles.details(userId);
          return userRole;
        } catch (error) {
          console.error("Fehler beim Abrufen der Benutzerrolle:", error);
        }
      }
      return null;
    },
    enabled: !!userId,
  };
});
