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
  Link,
  Avatar,
  AvatarGroup,
  Tooltip,
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
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import { SplashScreen } from "src/components/splash-screen";
import { ColumnDef, DataTable } from "src/components/data-table";
import { useRentalObjectStatusPill } from "src/hooks/use-status-pill";
import { getInitials } from "src/utils/get-initials";
import { getRenterName } from "src/utils/get-renter-name";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { useUser } from "src/hooks/use-user";
import { RouterLink } from "src/components/router-link";

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
  // const rentersIds = React.useMemo(() => rentalObject?.renter.map((renter) => renter.id), [rentalObject]);

  // const objectsSelection = useSelection<string>(objectsIds);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(objectsIds);

  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { user, error } = useUser();

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

  // if (isLoading) {
  //   return <SplashScreen />;
  // }

  function handleDelete() {}

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Link
            component={RouterLink}
            color="text.primary"
            sx={{ whiteSpace: "nowrap" }}
            variant="subtitle2"
            href={`${paths.landlordportal.dashboard.objects.details}${encodeURIComponent(row.id)}`}
          >
            {row.name}
          </Link>
        </div>
      ),
      name: "Name",
      width: "250px",
    },
    {
      formatter: (row): React.JSX.Element => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const statusPill = useRentalObjectStatusPill(row);
        return statusPill;
      },

      name: "Status",
      width: "100px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <Stack alignItems="center" direction="row" spacing={1}>
          <AvatarGroup max={3}>
            {row.renter
              ?.filter((renter) => renter.state !== 0)
              .map((renter) => (
                <Tooltip
                  key={getRenterName(renter.firstname, renter.surname)}
                  title={getRenterName(renter.firstname, renter.surname)}
                >
                  <Avatar
                    src={row.image}
                    sx={{
                      height: 42,
                      width: 42,
                    }}
                  >
                    {getInitials(getRenterName(renter.firstname, renter.surname))}
                  </Avatar>
                </Tooltip>
              ))}
          </AvatarGroup>
        </Stack>
      ),
      name: "Mieter",
      width: "250px",
    },
  ] satisfies ColumnDef<RentalObject>[];

  return (
    <>
      <Seo title="Dashboard: Übersicht" />
      <RoleBasedGuard permission="/landlordportal/dashboard/objects">
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
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
                    <Typography variant="h4">Objekte</Typography>
                  </div>
                  <Stack direction="row" spacing={4}>
                    <Button
                      component={RouterLink}
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
              <Grid xs={12} sx={{ overflowX: "auto" }}>
                <DataTable<RentalObject>
                  columns={columns}
                  rows={rentalObjects}
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
        <DeleteModal
          setOpenDeleteModal={setOpenDeleteModal}
          onDelete={handleDelete}
          openDeleteModal={openDeleteModal}
        />
      </RoleBasedGuard>
    </>
  );
};

export default Page;
