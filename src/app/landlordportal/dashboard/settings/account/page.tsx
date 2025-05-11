"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AccountDetails } from "src/components/settings/landlord/account-details";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import agent from "src/api/agent";
import { useUser } from "src/hooks/use-user";
import { Subscription } from "src/components/settings/landlord/subscription";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = {
//   title: `Account | Settings | Dashboard| Kontoeinstellungen  | ${site.name}`,
// } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const setLandlord = useSetRecoilState(currentUserAtom);
  const { user } = useUser();
  const landlord = useRecoilValue(currentUserAtom);

  const canSeeSubscriptionCard = "hasAccess" in landlord && landlord?.hasAccess && landlord?.priceId !== "price_1RLqlBFJT2pyPaEfkiFIo14q"; // Einmaliger plan price Id. Abändern, wenn live!

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLandlord() {
    try {
      const authenticatedUserId = user?.id;
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
        setLandlord(landlord);
      }
    } catch (error) {
      console.error(error);
    }
  }
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
