export const paths = {
  index: "/",
  checkout: "/checkout",
  contact: "/contact",
  marketing: {
    legal: {
      imprint: "/legal/imprint",
      terms: "/legal/terms",
      cancellation: "/legal/cancellation",
      privacyPolicy: "/legal/privacypolicy",
    },
  },
  auth: {
    auth0: {
      callback: "/auth/auth0/callback",
      login: "/auth/auth0/login",
    },
    jwt: {
      login: "/auth/jwt/login",
      register: "/auth/jwt/register",
    },
    firebase: {
      login: "/auth/firebase/login",
      register: "/auth/firebase/register",
    },
    amplify: {
      confirmRegister: "/auth/amplify/confirm-register",
      forgotPassword: "/auth/amplify/forgot-password",
      login: "/auth/amplify/login",
      register: "/auth/amplify/register",
      resetPassword: "/auth/amplify/reset-password",
    },
    supabase: {
      callback: { implicit: "/auth/supabase/callback/implicit", pkce: "/auth/supabase/callback/pkce" },
      signIn: "/auth/supabase/sign-in",
      signUp: "/auth/supabase/sign-up",
      signUpConfirm: "/auth/supabase/sign-up-confirm",
      resetPassword: "/auth/supabase/reset-password",
      recoveryLinkSent: "/auth/supabase/recovery-link-sent",
      updatePassword: "/auth/supabase/update-password",
    },
  },
  landlordportal: {
    dashboard: {
      index: "/landlordportal/dashboard",
      pricing: "/landlordportal/dashboard/pricing",
      objects: {
        index: "/landlordportal/dashboard/objects",
        details: "/landlordportal/dashboard/objects/:objectId?objectId=",
        edit: "/landlordportal/dashboard/objects/edit/:objectId?objectId=",
        create: "/landlordportal/dashboard/objects/create",
      },
      renters: {
        index: "/landlordportal/dashboard/renters",
        details: "/landlordportal/dashboard/renters/:renterId?renterId=",
        edit: "/landlordportal/dashboard/renter/:renterId/edit",
        create: "/landlordportal/dashboard/renters/create",
      },
      finances: {
        index: "/landlordportal/dashboard/finances",
      },
      settings: {
        account: "/landlordportal/dashboard/settings/account",
        integrations: "/landlordportal/dashboard/settings/integrations",
      },
    },
  },

  renterportal: {
    dashboard: {
      index: "/renterportal/dashboard",
      objects: {
        index: "/renterportal/dashboard/objects",
      },
      settings: {
        account: "/renterportal/dashboard/settings/account",
      },
    },
  },

  notAuthorized: "/errors/401",
  notFound: "/errors/not-found",
  serverError: "/errors/500",
};
