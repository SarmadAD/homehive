"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AccountDetails } from "src/components/settings/landlord/account-details";
import { Subscription } from "src/components/settings/landlord/subscription";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { useAtomValue } from "jotai";

export default function Page(): React.JSX.Element {
  const { data: landlord } = useAtomValue(currentLandlordAtom);
  const oneTimePriceId = process.env.NODE_ENV === "development" ? "price_1RLqlBFJT2pyPaEfkiFIo14q" : "price_1RfN2uFAQVAyiPDH9FsKyzZ2";
  const canSeeSubscriptionCard = landlord && "hasAccess" in landlord && landlord?.hasAccess && landlord?.priceId !== oneTimePriceId;

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4">Kontoeinstellungen</Typography>
      </div>
      <Stack spacing={4}>
        <AccountDetails />
      </Stack>
      {canSeeSubscriptionCard && (
        <Stack spacing={4}>
          <Subscription />
        </Stack>
      )}
    </Stack>
  );
}
