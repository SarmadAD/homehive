import * as React from "react";
import { UserContext } from "src/contexts/auth/firebase/user-context";
import type { UserContextValue } from "src/contexts/auth/types";

export function useUser(): UserContextValue {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
