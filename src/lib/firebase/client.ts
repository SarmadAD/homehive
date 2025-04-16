"use client";

import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { firebaseConfig } from "src/config";

// This executes on the client only, so we can cache the app instance.
let appInstance: FirebaseApp;

export function getFirebaseApp(): FirebaseApp {
  if (appInstance) {
    return appInstance;
  }

  appInstance = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });

  return appInstance;
}
