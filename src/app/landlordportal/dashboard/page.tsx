"use client";

import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Backdrop, CircularProgress } from "@mui/material";
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { OverviewRentalIncome } from "src/sections/dashboard/overview/overview-rental-income";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import { RoleBasedGuard } from "../../auth/role/RoleBasedGuard";

export default function Page(): React.JSX.Element {
  const settings = useSettings();

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
