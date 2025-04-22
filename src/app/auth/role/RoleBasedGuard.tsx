import { useRecoilValue } from "recoil";
import { permissionSelector } from "src/state/selectors/permissionSelector";

interface Props {
  children: React.ReactNode;
  permission: string;
}

export const RoleBasedGuard = ({ children, permission }: Props) => {
  const checkPermission = useRecoilValue(permissionSelector);

  if (!checkPermission(permission)) {
    return null;
  }

  return <>{children}</>;
};
