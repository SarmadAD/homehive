"use client";

import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useSearchParams } from "src/hooks/use-search-params";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { paths } from "src/paths";
import agent from "src/api/agent";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, UserCredential } from "firebase/auth";
import { toast } from "src/components/toaster";
import { getFirebaseAuth } from "src/lib/auth/firebase/client";
import { z as zod } from "zod";
import { GuestGuard } from "../../guest-guard";
import { SplitLayout } from "src/components/split-layout";
import { Logo } from "src/components/logo";
import { useRouter } from "next/navigation";

interface OAuthProvider {
  id: "google" | "github";
  name: string;
  logo: string;
}

const oAuthProviders = [
  { id: "google", name: "Google", logo: "/assets/logos/logo-google.svg" },
] satisfies OAuthProvider[];

const schema = zod.object({
  email: zod.string().min(1, { message: "Email is required" }).email(),
  password: zod.string().min(1, { message: "Password is required" }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: "", password: "" } satisfies Values;

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [firebaseAuth] = React.useState<Auth>(getFirebaseAuth());
  const [showPassword, setShowPassword] = React.useState<boolean>();
  // const { issuer, signInWithEmailAndPassword, signInWithGoogle, signOut } = useAuth<AuthContextType>();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  async function checkIfUserIsLandlord(user: UserCredential) {
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

  async function checkIfUserIsRenter(user: UserCredential) {
    let result = false;
    try {
      const renter = await agent.renter.details(user.user.uid);
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

  async function createLandlord(user: UserCredential) {
    try {
      const firebaseUserId = user.user.uid;
      await agent.landlord.create(firebaseUserId);
    } catch (error) {
      console.error(error);
    }
  }

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
        let path = "";
        const user = await signInWithPopup(firebaseAuth, provider);

        if (await checkIfUserIsLandlord(user)) {
          router.push(paths.landlordportal.dashboard.index);
        } else if (await checkIfUserIsRenter(user)) {
          router.push(paths.renterportal.dashboard.objects.index);
        } else {
          // If user is neither a landlord nor a renter, default should be LandLord
          await createLandlord(user);
          router.push(paths.landlordportal.dashboard.index);
        }
      } catch (err) {
        setIsPending(false);
        toast.error((err as { message: string }).message);
      }
    },
    [firebaseAuth]
  );

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      try {
        let path = "";
        const user = await signInWithEmailAndPassword(firebaseAuth, values.email, values.password);
        if (await checkIfUserIsLandlord(user)) {
          router.push(paths.landlordportal.dashboard.index);
        } else if (await checkIfUserIsRenter(user)) {
          router.push(paths.renterportal.dashboard.objects.index);
        }
      } catch (err) {
        setError("root", { type: "server", message: (err as { message: string }).message });
        setIsPending(false);
      }
    },
    [firebaseAuth, setError]
  );

  usePageView();

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
            <Typography variant="h5">Sign in</Typography>
            <Typography color="text.secondary" variant="body2">
              Don&apos;t have an account?{" "}
              <Link component={RouterLink} href={paths.auth.firebase.register} variant="subtitle2">
                Sign up
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
            <Stack spacing={2}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
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
                        <OutlinedInput
                          {...field}
                          endAdornment={
                            showPassword ? (
                              <EyeIcon
                                cursor="pointer"
                                fontSize="var(--icon-fontSize-md)"
                                onClick={(): void => {
                                  setShowPassword(false);
                                }}
                              />
                            ) : (
                              <EyeSlashIcon
                                cursor="pointer"
                                fontSize="var(--icon-fontSize-md)"
                                onClick={(): void => {
                                  setShowPassword(true);
                                }}
                              />
                            )
                          }
                          label="Password"
                          type={showPassword ? "text" : "password"}
                        />
                        {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                  {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                  <Button disabled={isPending} type="submit" variant="contained">
                    Sign in
                  </Button>
                </Stack>
              </form>
              {/* <div>
            <Link component={RouterLink} href={paths.auth.firebase.re} variant="subtitle2">
              Forgot password?
            </Link>
          </div> */}
            </Stack>
          </Stack>
        </Stack>
      </SplitLayout>
    </GuestGuard>
  );
}
