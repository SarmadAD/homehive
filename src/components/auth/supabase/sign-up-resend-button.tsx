"use client";

import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import { paths } from "src/paths";
import { toast } from "src/components/toaster";

export interface SignUpResendButtonProps {
  children: React.ReactNode;
  email: string;
}

export function SignUpResendButton({ children, email }: SignUpResendButtonProps): React.JSX.Element {
  const [supabaseClient] = React.useState(createSupabaseClient());

  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const handleAction = React.useCallback(async (): Promise<void> => {
    setIsPending(true);
    setSubmitError(undefined);

    const redirectToUrl = new URL(paths.auth.supabase.callback.implicit, window.location.origin);
    redirectToUrl.searchParams.set("next", paths.landlordportal.dashboard.index);

    const { error } = await supabaseClient.auth.resend({
      email,
      type: "signup",
      options: { emailRedirectTo: redirectToUrl.href },
    });

    if (error) {
      setSubmitError(error.message);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    toast.success("Verification email sent");
  }, [supabaseClient, email]);

  return (
    <Stack spacing={1}>
      <Button disabled={isPending} onClick={handleAction} variant="contained">
        {children}
      </Button>
      {submitError ? <Alert color="error">{submitError}</Alert> : null}
      <Typography sx={{ textAlign: "center" }} variant="body2">
        Warte ein paar Minuten und versuche es dann erneut.{" "}
      </Typography>
    </Stack>
  );
}
