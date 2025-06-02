"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Integrations } from "src/components/settings/landlord/integrations";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Integrations | Settings | Dashboard | ${site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4">Integrationen</Typography>
      </div>
      <Integrations
        integrations={[
          {
            id: "tink",
            name: "Bankverbindung herstellen",
            icon: "",
            description: "Verbinde dein Bankkonto, um Mieteingänge nachzuverfolgen",
            connected: false,
          },
        ]}
      />
    </Stack>
  );
}
