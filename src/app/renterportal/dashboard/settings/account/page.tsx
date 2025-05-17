"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AccountDetails } from "src/components/settings/landlord/account-details";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Account | Settings | Dashboard | ${site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4">Kontoeinstellungen</Typography>
      </div>
      <Stack spacing={4}>
        <AccountDetails />
      </Stack>
    </Stack>
  );
}
