"use client";

import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { OverviewRepairRequest } from "src/sections/dashboard/overview/overview-repair-request";
import { OverviewRentalIncome } from "src/sections/dashboard/overview/overview-rental-income";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import { useEffect } from "react";
import agent from "src/api/agent";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth/firebase";
import { useSetRecoilState } from "recoil";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";

const Page = () => {
  usePageView();
  const settings = useSettings();
  const setLandlord = useSetRecoilState(currentLandlordAtom);

  const { user } = useAuth<AuthContextType>();

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
    <>
      <Seo title="Dashboard: Übersicht" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
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
                  <Typography variant="h4">Dashboard</Typography>
                </div>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewRentPaid showActions={true} />
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewRepairRequest showActions={true} />
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewStatusObjects showActions={true} />
            </Grid>
            <Grid xs={12} md={12}>
              <OverviewRentalIncome
                chartSeries={[
                  {
                    name: "This year",
                    data: [40, 37, 41, 42, 45, 42, 36, 45, 40, 44, 38, 41],
                  },
                ]}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
