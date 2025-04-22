import { UserRole } from "prisma/types/userrole";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import agent from "src/api/agent";
import { AuthContextType } from "src/contexts/auth/firebase";
import { useAuth } from "src/hooks/use-auth";
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
