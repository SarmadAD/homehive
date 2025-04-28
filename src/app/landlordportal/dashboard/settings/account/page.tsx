"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AccountDetails } from "src/components/settings/landlord/account-details";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import agent from "src/api/agent";
import { useUser } from "src/hooks/use-user";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = {
//   title: `Account | Settings | Dashboard| Kontoeinstellungen  | ${site.name}`,
// } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const setLandlord = useSetRecoilState(currentUserAtom);
  const { user } = useUser();

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLandlord() {
    try {
      const firebaseUserId = user?.id;
      if (firebaseUserId) {
        const landlord = await agent.landlord.details(firebaseUserId);
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
    </Stack>
  );
}
