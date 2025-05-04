"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import { useUser } from "src/hooks/use-user";
import { logger } from "src/lib/default-logger";
import { auth } from "src/config";
import { AuthStrategy } from "src/lib/auth/strategy";
import { paths } from "src/paths";

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      logger.debug("[AuthGuard]: User is not logged in, redirecting to sign in");

      switch (auth.strategy) {
        // case AuthStrategy.CUSTOM: {
        //   router.replace(paths.auth.custom.signIn);
        //   return;
        // }
        // case AuthStrategy.AUTH0: {
        //   router.replace(paths.auth.auth0.signIn);
        //   return;
        // }
        // case AuthStrategy.COGNITO: {
        //   router.replace(paths.auth.cognito.signIn);
        //   return;
        // }
        // case AuthStrategy.FIREBASE: {
        //   router.replace(paths.auth.firebase.login);
        //   return;
        // }
        case AuthStrategy.SUPABASE: {
          router.replace(paths.auth.supabase.signIn);
          return;
        }
        default: {
          logger.error("[AuthGuard]: Unknown auth strategy");
          return;
        }
      }
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
