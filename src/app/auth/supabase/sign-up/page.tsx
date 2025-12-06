"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/components/router-link";
import { useRouter } from "next/navigation";
import { paths } from "src/paths";
import agent from "src/api/agent";
import { Divider, FormControl, InputLabel, OutlinedInput, FormHelperText, FormControlLabel, Checkbox, Alert, Stack } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";
import { toast } from "src/components/toaster";
import { zodResolver } from "@hookform/resolvers/zod";
import { SplitLayout } from "src/components/split-layout";
import { GuestGuard } from "../../guest-guard";
import { Logo } from "src/components/logo";
import { createClient as createSupabaseClient } from "../../../../lib/supabase/client";

// import { site } from "src/config";
// import { Metadata } from "next/types";

interface OAuthProvider {
  id: "google" | "discord";
  name: string;
  logo: string;
}
// export const metadata = { title: `Register | Registrieren | ${site.name}` } satisfies Metadata;

const oAuthProviders = [{ id: "google", name: "Google", logo: "/assets/logos/logo-google.svg" }] satisfies OAuthProvider[];

const schema = zod.object({
  // firstName: zod.string().min(1, { message: "Vorname ist erforderlich" }),
  // lastName: zod.string().min(1, { message: "Nachname ist erforderlich" }),
  email: zod.string().min(1, { message: "E-Mail ist erforderlich" }).email(),
  password: zod.string().min(6, { message: "Das Passwort muss mindestens 6 Zeichen lang sein" }),
  // terms: zod.boolean().refine((value) => value, "Du musst die Allgemeinen Geschäftsbedingungen akzeptieren."),
});

type Values = zod.infer<typeof schema>;

// const defaultValues = { email: "", password: "", terms: false } satisfies Values;
const defaultValues = { email: "", password: "" } satisfies Values;

const Page = () => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [supabaseClient] = React.useState(createSupabaseClient());

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onAuth = React.useCallback(
    async (providerId: OAuthProvider["id"]): Promise<void> => {
      setIsPending(true);

      const redirectToUrl = new URL(paths.auth.supabase.callback.pkce, window.location.origin);
      redirectToUrl.searchParams.set("next", paths.landlordportal.dashboard.index);

      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: providerId,
        options: { redirectTo: redirectToUrl.href },
      });

      if (error) {
        setIsPending(false);
        toast.error(error.message);
        return;
      }

      window.location.href = data.url;
    },
    [supabaseClient]
  );

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      // It is really important that you read the official notes
      // under "If signUp() is called for an existing confirmed user"
      // https://supabase.com/docs/reference/javascript/auth-signup
      // If a user already exists with this email, they will not
      // receive a confirmation email.

      const redirectToUrl = new URL(paths.auth.supabase.callback.pkce, window.location.origin); // POTENZIELLER BUG, könnte der Renter schon da sein? In pkce wird auch auf renter geprüft
      redirectToUrl.searchParams.set("next", paths.landlordportal.dashboard.index);

      const { data, error } = await supabaseClient.auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo: redirectToUrl.href },
      });

      if (error) {
        setError("root", { type: "server", message: error.message });
        setIsPending(false);
        return;
      }

      if (data.session) {
        // UserProvider will handle Router refresh
        // After refresh, GuestGuard will handle the redirect
        return;
      }

      if (data.user) {
        const searchParams = new URLSearchParams({ email: values.email });
        router.push(`${paths.auth.supabase.signUpConfirm}?${searchParams.toString()}`);
        return;
      }

      setIsPending(false);
    },
    [supabaseClient, router, setError]
  );
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
            <Typography variant="h5">Registrieren</Typography>
            <Typography color="text.secondary" variant="body2">
              Bereits ein Konto?{" "}
              <Link component={RouterLink} href={paths.auth.supabase.signIn} variant="subtitle2">
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
                      <InputLabel>Vorname</InputLabel>
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
                      <InputLabel>Nachname</InputLabel>
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
                      <OutlinedInput {...field} type="email" name="E-Mail-Adresse" />
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
                      <OutlinedInput {...field} type="password" name="Passwort" />
                      {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
                {/* <Controller
                  control={control}
                  name="terms"
                  render={({ field }) => (
                    <div>
                      <FormControlLabel
                        control={<Checkbox {...field} />}
                        label={
                          <React.Fragment>
                            Mit der Registrierung akzeptiere ich <Link href={paths.marketing.legal.terms}>AGB</Link> &
                            <Link href={paths.marketing.legal.privacyPolicy}>Datenschutzerklärung</Link>.
                          </React.Fragment>
                        }
                      />
                      {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
                    </div>
                  )}
                /> */}
                {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                <Button disabled={isPending} type="submit" variant="contained">
                  Konto erstellen
                </Button>
                <Typography color="text.secondary" variant="body2" sx={{ textAlign: "center" }}>
                  Mit der Registrierung akzeptiere ich <Link href={paths.marketing.legal.terms}>AGB</Link> &
                  <Link href={paths.marketing.legal.privacyPolicy}> Datenschutzerklärung</Link>.
                </Typography>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </SplitLayout>
    </GuestGuard>
  );
};

export default Page;
