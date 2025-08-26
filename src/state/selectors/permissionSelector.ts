import { selector } from "recoil";
import { userRoleAtom } from "../atoms/userRoleAtom";

const permissions = [
  {
    permission: "/landlordportal/dashboard",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/objects",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/renters",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/finances",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/rentalagreements",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/rentalagreements/create",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/pricing",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/objects/create",
    role: "Landlord",
  },
  {
    permission: "/landlordportal/dashboard/renters/create",
    role: "Landlord",
  },
  {
    permission: "showLandlordPortalName",
    role: "Landlord",
  },
  {
    permission: "/renterportal/dashboard/objects",
    role: "Renter",
  },
  {
    permission: "/renterportal/dashboard",
    role: "Renter",
  },
  {
    permission: "showRenterPortalName",
    role: "Renter",
  },
];

export const permissionSelector = selector({
  key: "permissionSelector",
  get: ({ get }) => {
    const userRole = get(userRoleAtom);
    return (permission: string) => {
      if (!userRole) return false;
      const matchedPermission = permissions.find((perm) => perm.permission === permission);
      return matchedPermission?.role === userRole.role.role;
    };
  },
});
