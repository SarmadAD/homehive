"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  CircularProgress,
  Button,
  SvgIcon,
  Link,
  IconButton,
} from "@mui/material";
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
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import type { Page as PageType } from "src/types/page";
import { paths } from "src/paths";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import { SplashScreen } from "src/components/splash-screen";
import React from "react";
import { ColumnDef, DataTable } from "src/components/data-table";
import { Renter } from "prisma/types/renter";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { RouterLink } from "src/components/router-link";

const Page: PageType = () => {
  usePageView();
  const settings = useSettings();

  const setLandlord = useSetRecoilState(currentUserAtom);
  const rentersSearch = useRentersSearch();
  const renters = useRecoilValue(rentersAtom);
  const rentersIds = useRentersIds(renters);
  // const rentersIds = React.useMemo(() => renters.map((renter) => renter.id), [renters]);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(rentersIds);

  // const rentersSelection = useSelection<string>(rentersIds);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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
  const handleAddRenter = () => {
    // setOpenAddRenterModal(true);
  };

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Link
            color="text.primary"
            sx={{ whiteSpace: "nowrap" }}
            variant="subtitle2"
            href={`${paths.landlordportal.dashboard.renters.details}${row.id}`}
          >
            {row.firstname} {row.surname}
          </Link>
        </div>
      ),
      name: "Name",
      width: "650px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <IconButton component={RouterLink} href={""}>
          <SvgIcon>
            <ArrowRightIcon />
          </SvgIcon>
        </IconButton>
      ),
      name: "",
      align: "right",
    },
  ] satisfies ColumnDef<Renter>[];

  return (
    <>
      <Seo title="Dashboard: Übersicht" />

      <RoleBasedGuard permission="/landlordportal/dashboard/renters">
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
            backgroundColor: "background.paper",
          }}
        >
          <Container maxWidth={settings.stretch ? false : "xl"}>
            <Grid container disableEqualOverflow>
              <Grid xs={12} pb={3}>
                <Stack direction="row" justifyContent="space-between" spacing={4}>
                  <div>
                    <Typography variant="h4">Mieter</Typography>
                  </div>
                  <Stack direction="row" spacing={4}>
                    <Button
                      startIcon={
                        <SvgIcon>
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                      href={paths.landlordportal.dashboard.renters.create}
                    >
                      Hinzufügen
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid xs={12} md={4}>
                <OverviewRentPaid showActions={false} />
              </Grid>

              <Grid xs={12} sx={{ overflowX: "auto", pt: 3 }}>
                <DataTable<Renter>
                  columns={columns}
                  rows={(renters as Renter[]) || []}
                  onDeselectAll={deselectAll}
                  onDeselectOne={(_, row) => {
                    deselectOne(row.id);
                  }}
                  onSelectAll={selectAll}
                  onSelectOne={(_, row) => {
                    selectOne(row.id);
                  }}
                  selected={selected}
                  setOpenDeleteModal={setOpenDeleteModal}
                  isLoading={isLoading}
                  selectable
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </RoleBasedGuard>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
