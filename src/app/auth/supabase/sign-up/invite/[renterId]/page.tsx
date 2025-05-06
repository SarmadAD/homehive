"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/components/router-link";
import { useMounted } from "src/hooks/use-mounted";
import { useRouter } from "src/hooks/use-router";
import { useSearchParams } from "src/hooks/use-search-params";
import { paths } from "src/paths";
import agent from "src/api/agent";
import { z as zod } from "zod";
import { toast } from "src/components/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { SplitLayout } from "src/components/split-layout";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, FormControl, FormControlLabel, InputLabel, OutlinedInput } from "@mui/material";
import { GuestGuard } from "src/app/auth/guest-guard";
import { createClient as createSupabaseClient } from "../../../../../../lib/supabase/client";
import { User } from "@supabase/supabase-js";
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
  // email: zod.string().min(1, { message: "E-Mail ist erforderlich" }).email(),
  password: zod.string().min(6, { message: "Das Passwort muss mindestens 6 Zeichen lang sein" }),
  terms: zod.boolean().refine((value) => value, "Du musst die Allgemeinen Geschäftsbedingungen akzeptieren."),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { password: "", terms: false } satisfies Values;

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const renterId = searchParams?.get("renterId");
  const [supabaseClient] = React.useState(createSupabaseClient());

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  useEffect(() => {
    const hash = window.location.hash || "#";
    const hashParams = new URLSearchParams(hash.split("#")[1]);
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (accessToken && refreshToken) {
      supabaseClient.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then((res) => {
        if (res.error) {
          console.log(res.error);
        }
      });
    }
  }, [supabaseClient]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { data: userData, error: userError } = await supabaseClient.auth.updateUser({
        password: values.password,
      });

      try {
        if (userData.user && (await checkIfUserIsLandlord(userData.user))) {
          router.push(paths.landlordportal.dashboard.index);
        } else if (userData.user && (await checkIfUserIsRenter(userData.user))) {
          router.push(paths.renterportal.dashboard.objects.index);
        } else if (userData.user && renterId) {
          const renterExistsWithAuthenticatedUserId = await checkIfRenterExistsWithAuthenticatedUserId(userData.user);
          if (renterExistsWithAuthenticatedUserId) {
            router.push(paths.renterportal.dashboard.objects.index);
          } else if ((await checkIfRenterExists()) && !renterExistsWithAuthenticatedUserId) {
            await updateRenterAuthenticatedUserId(userData.user);
            router.push(paths.renterportal.dashboard.objects.index);
          }
        }
      } catch (err) {
        setError("root", { type: "server", message: (err as { message: string }).message });
        setIsPending(false);
      }
    },
    [supabaseClient, router, setError]
  );

  async function checkIfUserIsRenter(user: User) {
    let result = false;
    try {
      const renter = await agent.renter.details(user.id);
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

  async function checkIfUserIsLandlord(user: User) {
    let result = false;
    try {
      const landlord = await agent.landlord.details(user.id);
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

  async function checkIfRenterExistsWithAuthenticatedUserId(user: User) {
    let result = false;
    try {
      const renter = await agent.renter.details(user.id);
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

  async function checkIfRenterExists() {
    let result = false;
    try {
      const renter = await agent.renters.details(renterId ?? "");
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

  async function updateRenterAuthenticatedUserId(user: User) {
    try {
      const authenticatedUserId = user.id;
      if (renterId && authenticatedUserId) {
        await agent.renters.updateAuthenticatedUserId(renterId, authenticatedUserId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <GuestGuard>
      <SplitLayout>
        <Stack spacing={4}>
          <div>
            <Box component={RouterLink} href={paths.index} sx={{ display: "inline-block", fontSize: 0 }}>
              <Logo width={35} height={35} fontSize={15} showLogoName={true} />
            </Box>
          </div>
          <Stack spacing={1}>
            <Typography variant="h5">Willkommen!</Typography>
            <Typography color="text.secondary" variant="body2">
              Vervollständige dein Konto indem du ein Passwort vergibst
            </Typography>
          </Stack>
          <Stack spacing={3}>
            {/* <Stack spacing={2}>
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
            </Stack> */}
            {/* <Divider>oder</Divider> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
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
                />
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
                /> */}
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
                  Konto verfollständigen
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
