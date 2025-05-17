"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AccountDetails } from "src/components/settings/landlord/account-details";
import { useRecoilValue } from "recoil";
import { Subscription } from "src/components/settings/landlord/subscription";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = {
//   title: `Account | Settings | Dashboard| Kontoeinstellungen  | ${site.name}`,
// } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const landlord = useRecoilValue(currentLandlordAtom);
  const canSeeSubscriptionCard = "hasAccess" in landlord && landlord?.hasAccess && landlord?.priceId !== "price_1RLqlBFJT2pyPaEfkiFIo14q"; // Einmaliger plan price Id. Abändern, wenn live!

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
