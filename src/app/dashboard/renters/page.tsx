"use client";

import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import agent from "src/api/agent";
import { Seo } from "src/components/seo";
import { AuthContextType } from "src/contexts/auth/firebase";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRentersSearch } from "src/hooks/use-renter-search";
import { useRentersIds } from "src/hooks/use-renters-ids";
import { useSelection } from "src/hooks/use-selection";
import { useSettings } from "src/hooks/use-settings";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { RenterListTable } from "src/sections/dashboard/renter/renter-list-table";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  usePageView();

  const settings = useSettings();

  const rentersSearch = useRentersSearch();
  const renters = useRecoilValue(rentersAtom);
  const rentersIds = useRentersIds(renters);
  const rentersSelection = useSelection<string>(rentersIds);
  const [isLoading, setIsLoading] = useState(false);

  const setLandlord = useSetRecoilState(currentLandlordAtom);

  const { user } = useAuth<AuthContextType>();

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
              <OverviewRentPaid showActions={false} />
            </Grid>

            <Grid xs={12} md={12}>
              {isLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <RenterListTable
                  count={renters.length}
                  items={renters}
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
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
