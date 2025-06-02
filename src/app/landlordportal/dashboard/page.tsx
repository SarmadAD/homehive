"use client";

import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Backdrop, CircularProgress } from "@mui/material";
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { OverviewRentalIncome } from "src/sections/dashboard/overview/overview-rental-income";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import { useState } from "react";
import { RoleBasedGuard } from "../../auth/role/RoleBasedGuard";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Dashboard | Übersicht | ${site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const settings = useSettings();

  // if (isLoading) {
  //   return (
  //     <Backdrop sx={(theme) => ({ color: "var(--mui-palette-primary-main)", zIndex: theme.zIndex.drawer + 1 })} open={isLoading}>
  //       <CircularProgress color="inherit" />
  //     </Backdrop>
  //   );
  // }

  return (
    <>
      <Seo title="Dashboard" />
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
                    <Typography variant="h4">Dashboard</Typography>
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
