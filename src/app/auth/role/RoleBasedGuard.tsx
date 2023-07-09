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
  {
    permission: "showLandlordPortalName",
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
