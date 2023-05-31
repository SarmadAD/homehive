import { Box, Container, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useSettings } from "src/hooks/use-settings";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { OverviewRepairRequest } from "src/sections/dashboard/overview/overview-repair-request";
import { OverviewRentalIncome } from "src/sections/dashboard/overview/overview-rental-income";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  const settings = useSettings();

  usePageView();

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
              <OverviewRepairRequest amount={12} />
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewStatusObjects amount={5} />
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

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
