import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Metadata } from "next/types";
import { site } from "src/config";
import { ResetPasswordForm } from "src/components/auth/supabase/reset-password-form";
import { SplitLayout } from "src/components/split-layout";
import { paths } from "src/paths";
import { GuestGuard } from "../../guest-guard";
import { Logo } from "src/components/logo";

export const metadata: Metadata = { title: `Reset password | Supabase | Auth | ${site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <SplitLayout>
        <Stack spacing={4}>
          <div>
            <Box component={RouterLink} href={paths.index} sx={{ display: "inline-block", fontSize: 0 }}>
              <Logo height={35} width={35} fontSize={32} showLogoName={true} />
            </Box>
          </div>
          <Typography variant="h5">Reset password</Typography>
          <ResetPasswordForm />
        </Stack>
      </SplitLayout>
    </GuestGuard>
  );
}
