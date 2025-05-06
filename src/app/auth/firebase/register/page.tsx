"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/components/router-link";
import { useRouter } from "next/navigation";
import { paths } from "src/paths";
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
import { SplitLayout } from "src/components/split-layout";
import { GuestGuard } from "../../guest-guard";
import { Logo } from "src/components/logo";
// import { site } from "src/config";
// import { Metadata } from "next/types";

interface OAuthProvider {
  id: "google";
  name: string;
  logo: string;
}
// export const metadata = { title: `Register | Registrieren | ${site.name}` } satisfies Metadata;

const oAuthProviders = [
  { id: "google", name: "Google", logo: "/assets/logos/logo-google.svg" },
] satisfies OAuthProvider[];

const schema = zod.object({
  // firstName: zod.string().min(1, { message: "First name is required" }),
  // lastName: zod.string().min(1, { message: "Last name is required" }),
  email: zod.string().min(1, { message: "E-Mail ist erforderlich" }).email(),
  password: zod.string().min(6, { message: "Das Passwort muss mindestens 6 Zeichen lang sein" }),
  terms: zod.boolean().refine((value) => value, "Du musst die Allgemeinen Geschäftsbedingungen akzeptieren."),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: "", password: "", terms: false } satisfies Values;

const Page = () => {
  const router = useRouter();
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
        // Only Landlords can register. It makes no sense that Renter can register
        let path = "";
        const user = await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password);
        if (!(await checkIfLandlordExists(user))) {
          await createLandlord(user);
        }
        // if (await checkIfLandlordExists(user)) {
        //   router.push(paths.landlordportal.dashboard.index);
        // } else {
        //   await createLandlord(user);
        //   router.push(paths.landlordportal.dashboard.index);
        // }
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
          provider.setCustomParameters({
            prompt: "select_account",
          });
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
          router.push(paths.landlordportal.dashboard.index);
        } else {
          await createLandlord(user);
          router.push(paths.landlordportal.dashboard.index);
        }

        // if (await checkIfRenterExists(user)) {
        //   path = returnTo || paths.renterportal.dashboard.objects.index;
        // } else {
        //   path = returnTo || paths.notAuthorized;
        // }

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
    <GuestGuard>
      <SplitLayout>
        <Logo width={35} height={35} fontSize={15} showLogoName={true} />
        <Stack spacing={4}>
          <div>
            <Box component={RouterLink} href={paths.index} sx={{ display: "inline-block", fontSize: 0 }}>
              {/* <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} /> */}
            </Box>
          </div>
          <Stack spacing={1}>
            <Typography variant="h5">Registrieren</Typography>
            <Typography color="text.secondary" variant="body2">
              Bereits ein Konto?{" "}
              <Link component={RouterLink} href={paths.auth.firebase.login} variant="subtitle2">
                Anmelden{" "}
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
                    Weiter mit {provider.name}
                  </Button>
                )
              )}
            </Stack>
            <Divider>oder</Divider>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                {/**Erstmal rausgenommen weil Firstname und Lastname nicht zur zeit gespeichert werden irgendwo. Daher macht es kein Sinn das der User diese ausfüllt */}

                {/* <Controller
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
                /> */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.email)}>
                      <InputLabel>E-Mail-Adresse</InputLabel>
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
                      <InputLabel>Passwort</InputLabel>
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
                            Ich habe die <Link>Allgemeinen Geschäftsbedingungen</Link> gelesen.
                          </React.Fragment>
                        }
                      />
                      {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
                    </div>
                  )}
                />
                {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                <Button disabled={isPending} type="submit" variant="contained">
                  Konto erstellen
                </Button>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </SplitLayout>
    </GuestGuard>
  );
};

export default Page;
