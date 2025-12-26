"use client";

import { Landlord } from "prisma/types/landlord";
import { useAtomValue } from "jotai";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { permissionAtom } from "src/state/atoms/permissionAtom";
import checkIfUserIsNotAllowedToCreateRentalObjects from "src/utils/hasAccessForCreateObjects";
import checkIfUserIsNotAllowedToCreateRenter from "src/utils/hasAccessForCreateRenter";

interface Props {
  children: React.ReactNode;
  permission: string;
}

export const RoleBasedGuard = ({ children, permission }: Props) => {
  const checkPermission = useAtomValue(permissionAtom);
  const currentLandlordResult = useAtomValue(currentLandlordAtom);
  const currentLandlord = currentLandlordResult.data;

  if (
    !checkPermission(permission) ||
    (currentLandlord && permission === "/landlordportal/dashboard/pricing" && "hasAccess" in currentLandlord && currentLandlord.hasAccess) ||
    (permission === "/landlordportal/dashboard/objects/create" && checkIfUserIsNotAllowedToCreateRentalObjects(currentLandlord as Landlord)) ||
    (permission === "/landlordportal/dashboard/renters/create" && checkIfUserIsNotAllowedToCreateRenter(currentLandlord as Landlord))
  ) {
    return null;
  }

  return <>{children}</>;
};
