import * as React from "react";
import RouterLink from "next/link";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { site } from "src/config";
import { GuestGuard } from "../../guest-guard";
import { SplitLayout } from "src/components/split-layout";
import { paths } from "src/paths";
import { Logo } from "src/components/logo";
import { Metadata } from "next/types";
import { SignUpResendButton } from "src/components/auth/supabase/sign-up-resend-button";

export const metadata: Metadata = { title: `Sign up confirm | E-Mail bestätigen | Supabase | Auth | ${site.name}` };

interface PageProps {
  searchParams: { email?: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { email } = searchParams;

  if (!email) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert color="error">E-Mail ist erforderlich</Alert>
      </Box>
    );
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
          <Typography variant="h5"> Bitte bestätige deine E-Mail-Adresse</Typography>
          <Typography>
            Wir haben eine Bestätigungs-E-Mail gesendet an{" "}
            <Typography component="span" variant="subtitle1">
              &quot;{email}&quot;
            </Typography>
            .
          </Typography>
          <SignUpResendButton email={email}>Erneut senden</SignUpResendButton>
        </Stack>
      </SplitLayout>
    </GuestGuard>
  );
}
