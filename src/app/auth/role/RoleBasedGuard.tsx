import { UserRole } from "prisma/types/userrole";
import { useEffect, useState } from "react";
import agent from "src/api/agent";
import { AuthContextType } from "src/contexts/auth/firebase";
import { useAuth } from "src/hooks/use-auth";

interface Props {
  children: React.ReactNode;
  permission: string;
}

const permissions = [
  {
    permission: "/dashboard",
    role: "Landlord",
  },
  {
    permission: "/dashboard/objects",
    role: "Landlord",
  },
  {
    permission: "/dashboard/renters",
    role: "Landlord",
  },
];

export const RoleBasedGuard = ({ children, permission }: Props) => {
  const { user } = useAuth<AuthContextType>();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    getUserRole();
  }, []);

  async function getUserRole() {
    if (user) {
      try {
        setHasPermission(false);
        const userRole = await agent.userRoles.details(user.id);
        if (userRole) {
          return checkPermission(userRole);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function checkPermission(userRole: UserRole) {
    const getPermission = permissions.find((localPermission) => localPermission.permission === permission);
    if (getPermission && getPermission.role === userRole.role.role) {
      setHasPermission(true);
    }
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};
