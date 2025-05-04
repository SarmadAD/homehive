"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import { useUser } from "src/hooks/use-user";
import { logger } from "src/lib/default-logger";
import { paths } from "src/paths";
import { useEffect } from "react";
import agent from "src/api/agent";

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  async function checkIfUserIsLandlord() {
    let result = false;
    try {
      setIsChecking(true);
      const authenticatedUserId = user?.id;
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
        if ("error" in landlord) {
          throw new Error(String(landlord.error));
        } else {
          result = true;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsChecking(false);
    }
    return result;
  }

  async function checkIfRenterExistsWithAuthenticatedUserId() {
    let result = false;
    try {
      const authenticatedUserId = user?.id;
      const renter = await agent.renter.details(authenticatedUserId);
      if ("error" in renter) {
        throw new Error(String(renter.error));
      } else {
        result = true;
      }
    } catch (error) {
      console.error(error);
    }
    return result;
  }

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (user) {
      if (await checkIfRenterExistsWithAuthenticatedUserId()) {
        logger.debug("[GuestGuard]: User is logged in, redirecting to renter portal");
        router.replace(paths.renterportal.dashboard.objects.index);
      } else if (await checkIfUserIsLandlord()) {
        logger.debug("[GuestGuard]: User is logged in, redirecting to landlord portal");
        router.replace(paths.landlordportal.dashboard.index);
      }
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
