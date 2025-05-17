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
  Menu,
  MenuItem,
  Card,
  Divider,
  Backdrop,
} from "@mui/material";
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRepairRequest } from "src/sections/dashboard/overview/overview-repair-request";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import type { Page as PageType } from "src/types/page";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { useCallback, useState, ChangeEvent, MouseEvent, useMemo, useEffect } from "react";
import { useSelection } from "src/hooks/use-selection";
import { paths } from "src/paths";
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import { ColumnDef, DataTable } from "src/components/data-table";
import { useRentalObjectStatusPill } from "src/hooks/use-status-pill";
import { getInitials } from "src/utils/get-initials";
import { getRenterName } from "src/utils/get-renter-name";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { RouterLink } from "src/components/router-link";
import { DotsVertical, Home02 } from "@untitled-ui/icons-react";
import { toast } from "src/components/toaster";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import checkIfUserIsNotAllowedToCreateRentalObjects from "src/utils/hasAccessForCreateObjects";
import { Landlord } from "prisma/types/landlord";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";

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

export default function Page(): React.JSX.Element {
  const settings = useSettings();
  const objectsSearch = useObjectsSearch();
  const rentalObjects = useRecoilValue(rentalObjectsAtom);
  const setRentalObjects = useSetRecoilState(rentalObjectsAtom);

  const setLandlord = useSetRecoilState(currentLandlordAtom);
  const landlordLoadable = useRecoilValueLoadable(currentLandlordAtom);
  const landloadLoading = landlordLoadable.state === "loading";
  const landlord = landlordLoadable.contents;

  const objectsIds = useObjectsIds(rentalObjects);
  // const rentersIds = React.useMemo(() => rentalObject?.renter.map((renter) => renter.id), [rentalObject]);

  // const objectsSelection = useSelection<string>(objectsIds);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(objectsIds);

  // const [isLoading, setIsLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Rental Object Menu Three Dots Menu
  const [anchorElRentalObjectThreeDotsMenu, setAnchorElRentalObjectThreeDotsMenu] = useState<null | HTMLElement>(null);
  const openRentalObjectThreeDotsMenu = Boolean(anchorElRentalObjectThreeDotsMenu);
  const handleClickRentalObjectThreeDotsMenu = (event: React.MouseEvent<HTMLButtonElement>, row: RentalObject) => {
    selectOne(row.id);
    setAnchorElRentalObjectThreeDotsMenu(event.currentTarget);
  };
  const handleCloseRentalObjectThreeDotsMenu = () => {
    setAnchorElRentalObjectThreeDotsMenu(null);
    deselectAll();
  };
  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  async function handleDelete() {
    try {
      const deltedObject = await agent.objects.delete(Array.from(selected)[0]);
      const updatedRentalObjects = rentalObjects.filter((object) => object.id !== deltedObject.id);
      setRentalObjects(updatedRentalObjects);
      setLandlord((prevLandlord) => ({
        ...prevLandlord,
        rentalObjects: updatedRentalObjects,
      }));
      toast.success("Objekt erfolgreich gelöscht");
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDeleteModal(false);
    }
  }

  function handleDeleteModalOpen() {
    setAnchorElRentalObjectThreeDotsMenu(null);
    setOpenDeleteModal(true);
  }

  function handleCancelDeleteModal() {
    setOpenDeleteModal(false);
    deselectAll();
  }

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
      // width: "150px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <Stack alignItems="center" direction="row" spacing={1}>
          <AvatarGroup max={3}>
            {row.renter
              ?.filter((renter) => renter.state !== 0)
              .map((renter) => (
                <Tooltip key={getRenterName(renter.firstname, renter.surname)} title={getRenterName(renter.firstname, renter.surname)}>
                  <Avatar src={row.image} sx={{ bgcolor: "#8a94a6", height: 42, width: 42 }}>
                    {getInitials(getRenterName(renter.firstname, renter.surname))}
                  </Avatar>
                </Tooltip>
              ))}
          </AvatarGroup>
        </Stack>
      ),
      name: "Mieter",
      // width: "250px",
    },
    {
      formatter: (row): React.JSX.Element => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const statusPill = useRentalObjectStatusPill(row);
        return statusPill;
      },

      name: "Status",
      // width: "100px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Button
            aria-controls={openRentalObjectThreeDotsMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openRentalObjectThreeDotsMenu ? "true" : undefined}
            onClick={(event) => handleClickRentalObjectThreeDotsMenu(event, row)}
          >
            <SvgIcon>
              <DotsVertical />
            </SvgIcon>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorElRentalObjectThreeDotsMenu}
            open={openRentalObjectThreeDotsMenu}
            onClose={handleCloseRentalObjectThreeDotsMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleDeleteModalOpen()}>Löschen</MenuItem>
          </Menu>
        </div>
      ),
      name: "",
      align: "right",
    },
  ] satisfies ColumnDef<RentalObject>[];

  // if (isLoading) {
  //   return (
  //     <Backdrop sx={(theme) => ({ color: "var(--mui-palette-primary-main)", zIndex: theme.zIndex.drawer + 1 })} open={isLoading}>
  //       <CircularProgress color="inherit" />
  //     </Backdrop>
  //   );
  // }

  return (
    <>
      <Seo title="Objekte" />
      <RoleBasedGuard permission="/landlordportal/dashboard/objects">
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
                    <Typography variant="h4">Objekte</Typography>
                  </div>
                  <Stack direction="row" spacing={4}>
                    <Tooltip
                      title={
                        checkIfUserIsNotAllowedToCreateRentalObjects(landlord as Landlord) ? (
                          <>
                            Mehr Objekte anlegen?{" "}
                            <Link component={RouterLink} href={paths.landlordportal.dashboard.pricing} underline="none">
                              Jetzt upgraden
                            </Link>
                          </>
                        ) : (
                          ""
                        )
                      }
                    >
                      <span>
                        <Button
                          component={RouterLink}
                          startIcon={
                            <SvgIcon>
                              <PlusIcon />
                            </SvgIcon>
                          }
                          variant="contained"
                          href={paths.landlordportal.dashboard.objects.create}
                          disabled={checkIfUserIsNotAllowedToCreateRentalObjects(landlord as Landlord)}
                        >
                          Hinzufügen
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>{" "}
              <Grid xs={12} md={4}>
                <OverviewStatusObjects showActions={false} />
              </Grid>
              <Grid xs={12}>
                <Card>
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
                    isLoading={landloadLoading}
                    rowStartIcon={<Home02 />}
                    selectable
                  />{" "}
                  {!rentalObjects.length && !landloadLoading ? (
                    <Box sx={{ p: 3 }}>
                      <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                        Es wurden noch keine Objekte angelegt
                      </Typography>
                    </Box>
                  ) : null}
                  <Divider />
                  <GeneralPagination
                    rowsPerPage={paginationState.rowsPerPage}
                    page={paginationState.page}
                    count={rentalObjects.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <DeleteModal
          text={"Möchtest Du wirklich das Objekt löschen?"}
          handleCancelDeleteModal={handleCancelDeleteModal}
          onDelete={handleDelete}
          openDeleteModal={openDeleteModal}
        />
      </RoleBasedGuard>
    </>
  );
}
