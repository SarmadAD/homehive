"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  SvgIcon,
  Link,
  Avatar,
  AvatarGroup,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  Divider,
  Theme,
  CardContent,
  List,
  ListItem,
  Grid,
} from "@mui/material";
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { OverviewStatusObjects } from "src/sections/dashboard/overview/overview-status-objects";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { useCallback, useState, ChangeEvent, MouseEvent, useMemo, useEffect } from "react";
import { useSelection } from "src/hooks/use-selection";
import { paths } from "src/paths";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import { RentalObject } from "prisma/types/objects";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import { ColumnDef, DataTable } from "src/components/data-table";
import { useRentalObjectStatusPill } from "src/hooks/use-status-pill";
import { getInitials } from "src/utils/get-initials";
import { getRenterName } from "src/utils/get-renter-name";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { RouterLink } from "src/components/router-link";
import { DotsVertical, Home02, Trash01 } from "@untitled-ui/icons-react";
import { toast } from "src/components/toaster";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import checkIfUserIsNotAllowedToCreateRentalObjects from "src/utils/hasAccessForCreateObjects";
import { Landlord } from "prisma/types/landlord";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { MobileCardSkeleton } from "src/skeleton/dashboard-skeletons";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAtom } from "jotai";
import { deleteRentalObjectAtom } from "src/state/atoms/deleteRentalObjectAtom";

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
  const [{ isLoading: rentalObjectLoading, isError: rentalObjectError, data: rentalObjectsData }] = useAtom(rentalObjectsAtom);
  const rentalObjects: RentalObject[] = rentalObjectsData ?? [];
  const [{ mutateAsync: deleteRentalObject }] = useAtom(deleteRentalObjectAtom);

  const [{ isLoading: landloadLoading, isError: landlordError, data: landlord }] = useAtom(currentLandlordAtom);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const objectsIds = useObjectsIds(rentalObjects);
  // const rentersIds = React.useMemo(() => rentalObject?.renter.map((renter) => renter.id), [rentalObject]);

  // const objectsSelection = useSelection<string>(objectsIds);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(objectsIds);

  // const [isLoading, setIsLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Rental Object Menu Three Dots Menu
  const [anchorElRentalObjectThreeDotsMenu, setAnchorElRentalObjectThreeDotsMenu] = useState<null | HTMLElement>(null);
  const openRentalObjectThreeDotsMenu = Boolean(anchorElRentalObjectThreeDotsMenu);
  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  const handleClickRentalObjectThreeDotsMenu = (event: React.MouseEvent<HTMLButtonElement>, row: RentalObject) => {
    selectOne(row.id);
    setAnchorElRentalObjectThreeDotsMenu(event.currentTarget);
  };
  const handleCloseRentalObjectThreeDotsMenu = () => {
    setAnchorElRentalObjectThreeDotsMenu(null);
    deselectAll();
  };
  async function handleDelete() {
    try {
      await deleteRentalObject(Array.from(selected)[0]);
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

  function MobileRentalObjectCard({ object }: { object: RentalObject }) {
    const statusPill = useRentalObjectStatusPill(object);

    return (
      <Box sx={{ mb: 2 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                  <SvgIcon>
                    <Home02 />
                  </SvgIcon>
                  <Typography variant="subtitle2">{object.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    href={`${paths.landlordportal.dashboard.objects.details}${encodeURIComponent(object.id)}`}
                    size="small"
                    color="primary"
                    sx={{ minWidth: 0, p: 1 }}
                    aria-label="Details anzeigen"
                  >
                    <SvgIcon>
                      <EyeIcon />
                    </SvgIcon>
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      selectOne(object.id);
                      setOpenDeleteModal(true);
                    }}
                    sx={{ minWidth: 0, p: 1 }}
                    aria-label="Löschen"
                  >
                    <Trash01 />
                  </Button>
                </Stack>
              </Stack>
              <List sx={{ "& .MuiListItem-root": { justifyContent: "space-between", px: 0, py: 1 } }}>
                <ListItem divider>
                  <Typography variant="subtitle2">Mieter</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {object.renter?.map((r) => `${r.firstname} ${r.surname}`).join(", ") || "—"}
                  </Typography>
                </ListItem>
                <ListItem divider>
                  <Typography variant="subtitle2">Status</Typography>
                  {statusPill}
                </ListItem>
              </List>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }
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
              spacing={{
                xs: 3,
                lg: 4,
              }}
            >
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12, md: 4 }}>
                <OverviewStatusObjects showActions={false} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card>
                  {!isMobile ? (
                    <DataTable<RentalObject>
                      columns={columns}
                      rows={rentalObjects ?? []}
                      onDeselectAll={deselectAll}
                      onDeselectOne={(_, row) => {
                        deselectOne(row.id);
                      }}
                      onSelectAll={selectAll}
                      onSelectOne={(_, row) => {
                        selectOne(row.id);
                      }}
                      selected={selected}
                      isLoading={landloadLoading || rentalObjectLoading}
                      rowStartIcon={<Home02 />}
                      selectable
                    />
                  ) : (
                    <Box sx={{ p: 2 }}>
                      {landloadLoading || rentalObjectLoading ? (
                        <>
                          <MobileCardSkeleton />
                          <MobileCardSkeleton />
                          <MobileCardSkeleton />
                        </>
                      ) : rentalObjects && rentalObjects.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                          Es wurden noch keine Objekte angelegt
                        </Typography>
                      ) : (
                        (rentalObjects ?? []).map((object) => <MobileRentalObjectCard key={object.id} object={object} />)
                      )}
                    </Box>
                  )}
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
          text={"Bist Du sicher, dass Du dieses Objekt dauerhaft löschen möchtest?" + " Dieser Vorgang kann nicht rückgängig gemacht werden."}
          handleCancelDeleteModal={handleCancelDeleteModal}
          onDelete={handleDelete}
          openDeleteModal={openDeleteModal}
        />
      </RoleBasedGuard>
    </>
  );
}
