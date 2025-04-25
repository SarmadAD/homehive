"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Integrations } from "src/components/settings/landlord/integrations";
import { useEffect } from "react";
import { useUser } from "src/hooks/use-user";
import { useSetRecoilState } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import agent from "src/api/agent";

// export const metadata = { title: `Integrations | Settings | Dashboard | ${site.name}` } satisfies Metadata;

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
        <Typography variant="h4">Integrations</Typography>
      </div>
      <Integrations
        integrations={[
          {
            id: "tink",
            name: "Tink",
            icon: "/assets/tink-logo.png",
            description: "Verbinde dein Bankkonto, um Mieteingänge nachzuverflogen",
            connected: false,
          },
        ]}
      />
    </Stack>
  );
}
