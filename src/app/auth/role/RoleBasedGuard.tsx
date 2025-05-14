import { Landlord } from "prisma/types/landlord";
import { useRecoilValue } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { permissionSelector } from "src/state/selectors/permissionSelector";
import checkIfUserIsNotAllowedToCreateRentalObjects from "src/utils/hasAccessForCreateObjects";
import checkIfUserIsNotAllowedToCreateRenter from "src/utils/hasAccessForCreateRenter";

interface Props {
  children: React.ReactNode;
  permission: string;
}

export const RoleBasedGuard = ({ children, permission }: Props) => {
  const checkPermission = useRecoilValue(permissionSelector);
  const currentLandlord = useRecoilValue(currentUserAtom);
  if (
    !checkPermission(permission) ||
    (permission === "/landlordportal/dashboard/pricing" && "hasAccess" in currentLandlord && currentLandlord.hasAccess) ||
    (permission === "/landlordportal/dashboard/objects/create" && checkIfUserIsNotAllowedToCreateRentalObjects(currentLandlord as Landlord)) ||
    (permission === "/landlordportal/dashboard/renters/create" && checkIfUserIsNotAllowedToCreateRenter(currentLandlord as Landlord))
  ) {
    return null;
  }

  return <>{children}</>;
};
