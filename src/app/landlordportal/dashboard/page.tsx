"use client";

import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { OverviewRentalIncome } from "src/sections/dashboard/overview/overview-rental-income";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import { useEffect, useState } from "react";
import agent from "src/api/agent";
import { useSetRecoilState } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { RoleBasedGuard } from "../../auth/role/RoleBasedGuard";
import { useUser } from "src/hooks/use-user";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Dashboard | Übersicht | ${site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const settings = useSettings();
  const setLandlord = useSetRecoilState(currentUserAtom);
  const [isLoading, setIsLoading] = useState(false);

  const { user, error } = useUser();

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLandlord() {
    try {
      setIsLoading(true);
      const firebaseUserId = user?.id;
      if (firebaseUserId) {
        const landlord = await agent.landlord.details(firebaseUserId);
        setLandlord(landlord);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Seo title="Übersicht" />
      <RoleBasedGuard permission="/landlordportal/dashboard">
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3,
            backgroundColor: "background.paper",
          }}
        >
          <Container maxWidth={settings.settings.stretch ? false : "xl"}>
            <Grid
              container
              disableEqualOverflow
              spacing={{
                xs: 3,
                lg: 4,
              }}
            >
              <Grid xs={12}>
                <Stack direction="row" justifyContent="space-between" spacing={4}>
                  <div>
                    <Typography variant="h4">Übersicht</Typography>
                  </div>
                </Stack>
              </Grid>
              <Grid xs={12} md={4}>
                <OverviewRentPaid showActions={true} />
              </Grid>
              <Grid xs={12} md={4}>
                {/* <OverviewRepairRequest showActions={true} /> */}
              </Grid>
              <Grid xs={12} md={4}>
                <OverviewStatusObjects showActions={true} />
              </Grid>
              <Grid xs={12} md={12}>
                <OverviewRentalIncome />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </RoleBasedGuard>
    </>
  );
}
