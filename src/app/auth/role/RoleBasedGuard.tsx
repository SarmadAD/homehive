import { useRecoilValue } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { userRoleAtom } from "src/state/atoms/userRoleAtom";
import { permissionSelector } from "src/state/selectors/permissionSelector";

interface Props {
  children: React.ReactNode;
  permission: string;
}

export const RoleBasedGuard = ({ children, permission }: Props) => {
  const checkPermission = useRecoilValue(permissionSelector);
  const currentLandlord = useRecoilValue(currentUserAtom);
  if (
    !checkPermission(permission) ||
    (permission === "/landlordportal/dashboard/pricing" && "hasAccess" in currentLandlord && currentLandlord.hasAccess)
  ) {
    return null;
  }

  return <>{children}</>;
};
