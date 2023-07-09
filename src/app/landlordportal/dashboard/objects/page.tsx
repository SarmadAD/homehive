"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  SvgIcon,
  CircularProgress,
} from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRepairRequest } from "src/sections/dashboard/overview/overview-repair-request";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import type { Page as PageType } from "src/types/page";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { useCallback, useState, ChangeEvent, MouseEvent, useMemo, useEffect } from "react";
import { useSelection } from "src/hooks/use-selection";
import { paths } from "src/paths";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import { ObjectListTable } from "../../../components/objects-list-table";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth/firebase";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";

interface Filters {
  query?: string;
}

interface ObjectsSearchState {
  filters: Filters;
  page: number;
  rowsPerPage: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

const useObjectsSearch = () => {
  const [state, setState] = useState<ObjectsSearchState>({
    filters: {
      query: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: "updatedAt",
    sortDir: "desc",
  });

  const handleFiltersChange = useCallback((filters: Filters): void => {
    setState((prevState) => ({
      ...prevState,
      filters,
    }));
  }, []);

  const handleSortChange = useCallback((sort: { sortBy: string; sortDir: "asc" | "desc" }): void => {
    setState((prevState) => ({
      ...prevState,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
    }));
  }, []);

  const handlePageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  }, []);

  return {
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

const useObjectsIds = (objects: RentalObject[] = []) => {
  return useMemo(() => {
    return objects.length > 0 ? objects.map((object) => object.id) : [];
  }, [objects]);
};

const Page: PageType = () => {
  usePageView();
  const settings = useSettings();
  const objectsSearch = useObjectsSearch();

  const rentalObjects = useRecoilValue(rentalObjectsAtom);
  const setLandlord = useSetRecoilState(currentUserAtom);
  const objectsIds = useObjectsIds(rentalObjects);
  const objectsSelection = useSelection<string>(objectsIds);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth<AuthContextType>();

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLandlord() {
    try {
      const firebaseUserId = user?.id;
      if (firebaseUserId) {
        setIsLoading(true);
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
      <RoleBasedGuard permission="/landlordportal/dashboard/objects">
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
                  <Stack direction="row" spacing={4}>
                    <Button
                      startIcon={
                        <SvgIcon>
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                      href={paths.landlordportal.dashboard.objects.create}
                    >
                      Hinzufügen
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid xs={12} md={4}>
                <OverviewRepairRequest showActions={false} />
              </Grid>
              <Grid xs={12} md={4}>
                <OverviewStatusObjects showActions={false} />
              </Grid>
              <Grid xs={12} md={12}>
                {/* <ObjectsListTable />
                 */}
                {/* <CustomerListSearch
                onFiltersChange={customersSearch.handleFiltersChange}
                onSortChange={customersSearch.handleSortChange}
                sortBy={customersSearch.state.sortBy}
                sortDir={customersSearch.state.sortDir} 
              /> */}
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
                  <ObjectListTable
                    count={rentalObjects.length}
                    items={rentalObjects}
                    onDeselectAll={objectsSelection.handleDeselectAll}
                    onDeselectOne={objectsSelection.handleDeselectOne}
                    onPageChange={objectsSearch.handlePageChange}
                    onRowsPerPageChange={objectsSearch.handleRowsPerPageChange}
                    onSelectAll={objectsSelection.handleSelectAll}
                    onSelectOne={objectsSelection.handleSelectOne}
                    page={objectsSearch.state.page}
                    rowsPerPage={objectsSearch.state.rowsPerPage}
                    selected={objectsSelection.selected}
                  />
                )}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </RoleBasedGuard>
    </>
  );
};

export default Page;
