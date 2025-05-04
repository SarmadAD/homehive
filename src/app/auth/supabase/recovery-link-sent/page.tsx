import * as React from "react";
import RouterLink from "next/link";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { site } from "src/config";
import { ResetPasswordButton } from "src/components/auth/supabase/reset-password-button";
import { SplitLayout } from "src/components/split-layout";
import { paths } from "src/paths";
import { GuestGuard } from "../../guest-guard";
import { Metadata } from "next/types";
import { Logo } from "src/components/logo";

export const metadata: Metadata = { title: `Recovery link sent | Supabase | Auth | ${site.name}` };

interface PageProps {
  searchParams: { email?: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { email } = searchParams;

  if (!email) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert color="error">Email is required</Alert>
      </Box>
    );
  }

  return (
    <GuestGuard>
      <SplitLayout>
        <Stack spacing={4}>
          <div>
            <Box component={RouterLink} href={paths.index} sx={{ display: "inline-block", fontSize: 0 }}>
              <Logo height={35} width={35} fontSize={32} showLogoName={true} />
            </Box>
          </div>
          <Typography variant="h5">Recovery link sent</Typography>
          <Stack spacing={1}>
            <Typography>
              If an account exists with email{" "}
              <Typography component="span" variant="subtitle1">
                &quot;{email}&quot;
              </Typography>
              , you will receive a recovery email.
            </Typography>
            <div>
              <Link component={RouterLink} href={paths.auth.supabase.resetPassword} variant="subtitle2">
                Use another email
              </Link>
            </div>
          </Stack>
          <ResetPasswordButton email={email}>Resend</ResetPasswordButton>
        </Stack>
      </SplitLayout>
    </GuestGuard>
  );
}
