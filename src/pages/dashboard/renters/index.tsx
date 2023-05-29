import { Box, Button, Container, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { useCallback, useState, ChangeEvent, MouseEvent, useEffect, useMemo } from "react";
import { renterApi } from "src/api/renter";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useRentersSearch } from "src/hooks/use-renter-search";
import { useRentersStore } from "src/hooks/use-renter-store";
import { useRentersIds } from "src/hooks/use-renters-ids";
import { useSelection } from "src/hooks/use-selection";
import { useSettings } from "src/hooks/use-settings";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { RenterListTable } from "src/sections/dashboard/renter/renter-list-table";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  usePageView();
  const settings = useSettings();

  const rentersSearch = useRentersSearch();
  const rentersStore = useRentersStore(rentersSearch.state);
  const rentersIds = useRentersIds(rentersStore.renters);
  const rentersSelection = useSelection<string>(rentersIds);

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
                  <Typography variant="h4">Mieter</Typography>
                </div>
              </Stack>
            </Grid>
            <Grid xs={12} md={4}>
              <OverviewRentPaid numberOfRentsPaid={3} rentNumber={5} showActions={false} />
            </Grid>
            <Grid xs={12} md={12}>
              <RenterListTable
                count={rentersStore.rentersCount}
                items={rentersStore.renters}
                onDeselectAll={rentersSelection.handleDeselectAll}
                onDeselectOne={rentersSelection.handleDeselectOne}
                onPageChange={rentersSearch.handlePageChange}
                onRowsPerPageChange={rentersSearch.handleRowsPerPageChange}
                onSelectAll={rentersSelection.handleSelectAll}
                onSelectOne={rentersSelection.handleSelectOne}
                page={rentersSearch.state.page}
                rowsPerPage={rentersSearch.state.rowsPerPage}
                selected={rentersSelection.selected}
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
