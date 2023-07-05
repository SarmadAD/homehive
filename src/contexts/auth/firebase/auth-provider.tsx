import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import type { User as FirebaseUser } from "@firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { firebaseApp } from "src/libs/firebase";
import type { User } from "src/types/user";
import { Issuer } from "src/utils/auth";

import type { State } from "./auth-context";
import { AuthContext, initialState } from "./auth-context";
import { useRecoilState } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";

const auth = getAuth(firebaseApp);

enum ActionType {
  AUTH_STATE_CHANGED = "AUTH_STATE_CHANGED",
}

type AuthStateChangedAction = {
  type: ActionType.AUTH_STATE_CHANGED;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type Action = AuthStateChangedAction;

const reducer = (state: State, action: Action): State => {
  if (action.type === "AUTH_STATE_CHANGED") {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useRecoilState(currentUserAtom);

  const handleAuthStateChanged = useCallback(
    (user: FirebaseUser | null) => {
      if (user) {
        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: true,
            user: {
              id: user.uid,
              avatar: user.photoURL || undefined,
              email: user.email ?? "",
              name: user.displayName ?? "",
            },
          },
        });
      } else {
        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    },
    [dispatch]
  );

  useEffect(
    () => onAuthStateChanged(auth, handleAuthStateChanged),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const _signInWithEmailAndPassword = useCallback(async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    if (auth.currentUser) {
      setUser({ ...user, firebaseUserId: auth.currentUser?.uid });
    }
  }, []);

  const _createUserWithEmailAndPassword = useCallback(async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const _signOut = useCallback(async (): Promise<void> => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.Firebase,
        createUserWithEmailAndPassword: _createUserWithEmailAndPassword,
        signInWithEmailAndPassword: _signInWithEmailAndPassword,
        signInWithGoogle,
        signOut: _signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
