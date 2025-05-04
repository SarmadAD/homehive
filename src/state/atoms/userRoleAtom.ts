import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { UserRole } from "prisma/types/userrole";
import { currentUserAtom } from "./currentUserAtom";

export const userRoleAtom = atom<UserRole | null>({
  key: "userRoleAtom",
  default: selector({
    key: "userRoleAtom/default",
    get: async ({ get }) => {
      const user = get(currentUserAtom);
      if (user?.id) {
        try {
          const userRole = await agent.userRoles.details(user.authenticatedUserId);
          return userRole;
        } catch (error) {
          console.error("Fehler beim Abrufen der Benutzerrolle:", error);
        }
      }
      return null;
    },
  }),
});
