"use client";

import { useCallback, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import type { AuthContextType } from "src/contexts/auth/firebase";
import { useAuth } from "src/hooks/use-auth";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { paths } from "src/paths";
import { useRecoilValue } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import agent from "src/api/agent";
import {
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "src/lib/auth/firebase/client";
import { toast } from "src/components/toaster";
import { zodResolver } from "@hookform/resolvers/zod";

interface OAuthProvider {
  id: "google";
  name: string;
  logo: string;
}

const oAuthProviders = [
  { id: "google", name: "Google", logo: "/assets/logos/logo-google.svg" },
] satisfies OAuthProvider[];

const schema = zod.object({
  firstName: zod.string().min(1, { message: "First name is required" }),
  lastName: zod.string().min(1, { message: "Last name is required" }),
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod.string().min(6, { message: "Password should be at least 6 characters" }),
  terms: zod.boolean().refine((value) => value, "You must accept the terms and conditions"),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { firstName: "", lastName: "", email: "", password: "", terms: false } satisfies Values;

const Page = () => {
  usePageView();
  const isMounted = useMounted();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [firebaseAuth] = React.useState<Auth>(getFirebaseAuth());
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  // const formik = useFormik({
  //   initialValues,
  //   validationSchema,
  //   onSubmit: async (values, helpers): Promise<void> => {
  //     try {
  //       await createUserWithEmailAndPassword(values.email, values.password);

  //       if (isMounted()) {
  //         router.push(returnTo || paths.landlordportal.dashboard.index);
  //       }
  //     } catch (err) {
  //       console.error(err);

  //       if (isMounted()) {
  //         helpers.setStatus({ success: false });
  //         helpers.setErrors({ submit: err.message });
  //         helpers.setSubmitting(false);
  //       }
  //     }
  //   },
  // });

  // useEffect(() => {
  //   const setUser = async () => {
  //     if (user.firebaseUserId) {
  //       await createLandlord();
  //     }
  //   };
  //   setUser();
  // }, [user]);

  // const handleGoogleClick = useCallback(async (): Promise<void> => {
  //   try {
  //     //Later here the logic for desciding if user is landlord or renter
  //     let path = "";
  //     const user = await signInWithGoogle();
  //     if (await checkIfLandlordExists(user)) {
  //       //If Landlord exists, redirect to login page
  //       await signOut();
  //       path = returnTo || paths.auth.firebase.login;
  //     } else {
  //       await createLandlord(user);
  //       path = returnTo || paths.landlordportal.dashboard.index;
  //     }

  //     // if (await checkIfRenterExists(user)) {
  //     //   path = returnTo || paths.renterportal.dashboard.objects.index;
  //     // } else {
  //     //   path = returnTo || paths.notAuthorized;
  //     // }
  //     if (isMounted()) {
  //       window.location.href = path;
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [router, signInWithGoogle, isMounted, returnTo]);

  async function checkIfLandlordExists(user: UserCredential) {
    let result = false;
    try {
      const landlord = await agent.landlord.details(user.user.uid);
      if ("error" in landlord) {
        throw new Error(String(landlord.error));
      } else {
        result = true;
      }
    } catch (error) {
      console.error(error);
    }
    return result;
  }

  // async function checkIfRenterExists(user: any) {
  //   let result = false;
  //   try {
  //     const renter = await agent.renter.details(user.uid);
  //     if ("error" in renter) {
  //       throw new Error(String(renter.error));
  //     } else {
  //       result = true;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   return result;
  // }

  async function createLandlord(user: UserCredential) {
    try {
      const firebaseUserId = user.user.uid;
      await agent.landlord.create(firebaseUserId);
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password);
        // UserProvider will handle Router refresh
        // After refresh, GuestGuard will handle the redirect
      } catch (err) {
        setError("root", { type: "server", message: (err as { message: string }).message });
        setIsPending(false);
      }
    },
    [firebaseAuth, setError]
  );

  const onAuth = React.useCallback(
    async (providerId: OAuthProvider["id"]): Promise<void> => {
      setIsPending(true);

      let provider: GoogleAuthProvider;

      switch (providerId) {
        case "google":
          provider = new GoogleAuthProvider();
          break;
        default:
          throw new Error(`Unknown provider: ${providerId}`);
      }

      try {
        //Later here the logic for desciding if user is landlord or renter
        let path = "";
        const user = await signInWithPopup(firebaseAuth, provider);
        if (await checkIfLandlordExists(user)) {
          //If Landlord exists, redirect to login page
          // await signOut();
          path = returnTo || paths.landlordportal.dashboard.index;
        } else {
          await createLandlord(user);
          path = returnTo || paths.landlordportal.dashboard.index;
        }

        // if (await checkIfRenterExists(user)) {
        //   path = returnTo || paths.renterportal.dashboard.objects.index;
        // } else {
        //   path = returnTo || paths.notAuthorized;
        // }
        if (isMounted()) {
          window.location.href = path;
        }
        // UserProvider will handle Router refresh
        // After refresh, GuestGuard will handle the redirect
      } catch (err) {
        setIsPending(false);
        toast.error((err as { message: string }).message);
      }
    },
    [firebaseAuth]
  );

  return (
    <Stack spacing={4}>
      <div>
        <Box component={RouterLink} href={paths.index} sx={{ display: "inline-block", fontSize: 0 }}>
          {/* <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} /> */}
        </Box>
      </div>
      <Stack spacing={1}>
        <Typography variant="h5">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{" "}
          <Link component={RouterLink} href={paths.auth.firebase.login} variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>
      <Stack spacing={3}>
        <Stack spacing={2}>
          {oAuthProviders.map(
            (provider): React.JSX.Element => (
              <Button
                color="secondary"
                disabled={isPending}
                endIcon={<Box alt="" component="img" height={24} src={provider.logo} width={24} />}
                key={provider.id}
                onClick={(): void => {
                  onAuth(provider.id).catch(() => {});
                }}
                variant="outlined"
              >
                Continue with {provider.name}
              </Button>
            )
          )}
        </Stack>
        <Divider>or</Divider>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.firstName)}>
                  <InputLabel>First name</InputLabel>
                  <OutlinedInput {...field} />
                  {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormControl error={Boolean(errors.lastName)}>
                  <InputLabel>Last name</InputLabel>
                  <OutlinedInput {...field} />
                  {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} type="email" />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} type="password" />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <div>
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label={
                      <React.Fragment>
                        I have read the <Link>terms and conditions</Link>
                      </React.Fragment>
                    }
                  />
                  {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
                </div>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
              Create account
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

export default Page;
