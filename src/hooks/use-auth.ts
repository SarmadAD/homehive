import { useContext } from "react";
import { AuthContext, AuthContextType as FirebaseAuthContextType } from "src/contexts/auth/firebase/auth-context";

type AuthContextType = FirebaseAuthContextType;

export const useAuth = <T = AuthContextType>() => useContext(AuthContext) as T;
