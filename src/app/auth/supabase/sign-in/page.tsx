"use client";

import { Alert, Box, Button, Divider, FormControl, FormHelperText, InputLabel, Link, OutlinedInput, Stack, Typography } from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { paths } from "src/paths";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import { toast } from "src/components/toaster";
import { z as zod } from "zod";
import { GuestGuard } from "../../guest-guard";
import { SplitLayout } from "src/components/split-layout";
import { Logo } from "src/components/logo";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createSupabaseClient } from "../../../../lib/supabase/client";

// import { site } from "src/config";
// import { Metadata } from "next/types";

interface OAuthProvider {
  id: "google" | "discord";
  name: string;
  logo: string;
}

const oAuthProviders = [{ id: "google", name: "Google", logo: "/assets/logos/logo-google.svg" }] satisfies OAuthProvider[];

const schema = zod.object({
  email: zod.string().min(1, { message: "E-Mail ist erforderlich" }).email(),
  password: zod.string().min(1, { message: "Passwort ist erforderlich" }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: "", password: "" } satisfies Values;

export default function Page(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>();
  const [supabaseClient] = React.useState<SupabaseClient>(createSupabaseClient());

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

      const { error } = await supabaseClient.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // You should resend the verification email.
          // For the sake of simplicity, we will just redirect to the confirmation page.
          const searchParams = new URLSearchParams({ email: values.email });
          router.push(`${paths.auth.supabase.signUpConfirm}?${searchParams.toString()}`);
        } else {
          if (error.status === 400) {
            setError("root", { type: "server", message: "Ungültige E-Mail oder Passwort" });
          } else {
            setError("root", { type: "server", message: error.message });
          }
          setIsPending(false);
        }
      } else {
        // UserProvider will handle Router refresh
        // After refresh, GuestGuard will handle the redirect
      }
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
            <Typography variant="h5">Anmelden</Typography>
            <Typography color="text.secondary" variant="body2">
              Noch kein Konto?{" "}
              <Link component={RouterLink} href={paths.auth.supabase.signUp} variant="subtitle2">
                Registrieren
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
            <Stack spacing={2}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)}>
                        <InputLabel htmlFor="email-input">E-Mail-Adresse</InputLabel>
                        <OutlinedInput {...field} type="email" name="E-Mail-Adresse" id="email-input" />
                        {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.password)}>
                        <InputLabel htmlFor="password-input">Passwort</InputLabel>
                        <OutlinedInput
                          {...field}
                          id="password-input"
                          name="Passwort"
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
                          label="Passwort"
                          type={showPassword ? "text" : "password"}
                        />
                        {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                  {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                  <Button disabled={isPending} type="submit" variant="contained" name="submit-button-login">
                    Anmelden
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </Stack>
      </SplitLayout>
    </GuestGuard>
  );
}
