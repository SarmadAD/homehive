import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Button, SvgIcon } from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useSettings } from "src/hooks/use-settings";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { OverviewRepairRequest } from "src/sections/dashboard/overview/overview-repair-request";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import type { Page as PageType } from "src/types/page";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { ObjectsOverview } from "src/sections/dashboard/objects/objects-overview";

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
                  <Typography variant="h4">Objekte</Typography>
                </div>
                <div>
                  <Stack direction="row" spacing={4}>
                    <Button
                      startIcon={
                        <SvgIcon>
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                    >
                      Hinzufügen
                    </Button>
                  </Stack>
                </div>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewRepairRequest amount={12} />
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewStatusObjects amount={5} />
            </Grid>
            <Grid xs={12} md={12}>
              <ObjectsOverview />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
