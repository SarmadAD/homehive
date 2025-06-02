import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { UserRole } from "prisma/types/userrole";
import { currentUserIdAtom } from "./currentUserIdAtom";

export const userRoleAtom = atom<UserRole | null>({
  key: "userRoleAtom",
  default: selector({
    key: "userRoleAtom/default",
    get: async ({ get }) => {
      const userId = get(currentUserIdAtom);
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
  }),
});
