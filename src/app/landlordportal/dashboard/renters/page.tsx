"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Button,
  SvgIcon,
  Link,
  Menu,
  MenuItem,
  Card,
  Divider,
  Tooltip,
  useMediaQuery,
  Theme,
  CardContent,
} from "@mui/material";
import { useMemo, useState } from "react";
import agent from "src/api/agent";
import { Seo } from "src/components/seo";
import { useRentersSearch } from "src/hooks/use-renter-search";
import { useRentersIds } from "src/hooks/use-renters-ids";
import { useSelection } from "src/hooks/use-selection";
import { useSettings } from "src/hooks/use-settings";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { paths } from "src/paths";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import React from "react";
import { ColumnDef, DataTable } from "src/components/data-table";
import { Renter } from "prisma/types/renter";
import { RouterLink } from "src/components/router-link";
import { DotsVertical, Trash01, User03 } from "@untitled-ui/icons-react";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { toast } from "src/components/toaster";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import checkIfUserIsNotAllowedToCreateRenter from "src/utils/hasAccessForCreateRenter";
import { Landlord } from "prisma/types/landlord";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { MobileCardSkeleton } from "src/skeleton/dashboard-skeletons";
import { useAtom } from "jotai";
import { deleteRenterAtom } from "src/state/atoms/deleteRenterAtom";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Renters | Mieter | ${site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const settings = useSettings();
  const [{ isLoading: landloadLoading, isError: landlordError, data: landlordData }] = useAtom(currentLandlordAtom);

  const landlord = landlordData ?? [];
  const rentersSearch = useRentersSearch();

  const [{ isLoading: rentersLoading, isError: rentersError, data: renters }] = useAtom(rentersAtom);
  const [{ mutateAsync: deleteRenter }] = useAtom(deleteRenterAtom);

  const rentersIds = useRentersIds(renters);
  // const rentersIds = React.useMemo(() => renters.map((renter) => renter.id), [renters]);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(rentersIds);

  // const rentersSelection = useSelection<string>(rentersIds);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Renter Menu Three Dots Menu
  const [anchorElRenterThreeDotsMenu, setAnchorElRenterThreeDotsMenu] = React.useState<null | HTMLElement>(null);
  const openRenterThreeDotsMenu = Boolean(anchorElRenterThreeDotsMenu);
  const handleClickRenterThreeDotsMenu = (event: React.MouseEvent<HTMLButtonElement>, row: Renter) => {
    selectOne(row.id);
    setAnchorElRenterThreeDotsMenu(event.currentTarget);
  };
  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  const isLoading = rentersLoading || landloadLoading;
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const handleCloseRenterThreeDotsMenu = () => {
    setAnchorElRenterThreeDotsMenu(null);
    deselectAll();
  };

  const handleDelete = async () => {
    try {
      const renterId = Array.from(selected)[0];
      if (!renterId) return;
      await deleteRenter(renterId);

      toast.success("Mieter erfolgreich gelöscht");
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDeleteModal(false);
    }
  };

  function handleDeleteModalOpen() {
    setAnchorElRenterThreeDotsMenu(null);
    setOpenDeleteModal(true);
  }

  function handleCancelDeleteModal() {
    setOpenDeleteModal(false);
    deselectAll();
  }

  const paginatedRenter = useMemo(() => {
    if (renters) {
      const startIndex = paginationState.page * paginationState.rowsPerPage;
      const endIndex = startIndex + paginationState.rowsPerPage;
      return renters.slice(startIndex, endIndex);
    }
  }, [renters, paginationState.page, paginationState.rowsPerPage]);

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Link
            component={RouterLink}
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
      // width: "650px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Button
            // component={RouterLink}
            // onClick={() => handleDialog(row.id)}
            // href={`${paths.landlordportal.dashboard.renters.details}${row.id}`}
            aria-controls={openRenterThreeDotsMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openRenterThreeDotsMenu ? "true" : undefined}
            onClick={(event) => handleClickRenterThreeDotsMenu(event, row)}
          >
            <SvgIcon>
              <DotsVertical />
            </SvgIcon>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorElRenterThreeDotsMenu}
            open={openRenterThreeDotsMenu}
            onClose={handleCloseRenterThreeDotsMenu}
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
  ] satisfies ColumnDef<Renter>[];

  function MobileRenterCard({ renter }: { renter: Renter }) {
    return (
      <Box sx={{ mb: 2 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                  <SvgIcon>
                    <User03 />
                  </SvgIcon>
                  <Typography variant="subtitle2">
                    {renter.firstname} {renter.surname}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    href={`${paths.landlordportal.dashboard.renters.details}${renter.id}`}
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
                      selectOne(renter.id);
                      setOpenDeleteModal(true);
                    }}
                    sx={{ minWidth: 0, p: 1 }}
                    aria-label="Löschen"
                  >
                    <Trash01 />
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }
  return (
    <>
      <Seo title="Mieter" />
      <RoleBasedGuard permission="/landlordportal/dashboard/renters">
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3,
            backgroundColor: "background.paper",
          }}
        >
          <Container maxWidth={settings.settings.stretch ? false : "xl"}>
            <Grid container>
              <Grid size={{ xs: 12 }} pb={3}>
                <Stack direction="row" justifyContent="space-between" spacing={4}>
                  <div>
                    <Typography variant="h4">Mieter</Typography>
                  </div>
                  <Stack direction="row" spacing={4}>
                    <Tooltip
                      title={
                        checkIfUserIsNotAllowedToCreateRenter(landlord as Landlord) ? (
                          <>
                            Mehr Mieter anlegen?{" "}
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
                          href={paths.landlordportal.dashboard.renters.create}
                          disabled={checkIfUserIsNotAllowedToCreateRenter(landlord as Landlord)}
                        >
                          Hinzufügen
                        </Button>{" "}
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <OverviewRentPaid showActions={false} />
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ pt: 3 }}>
                <Card>
                  {!isMobile ? (
                    <>
                      <DataTable<Renter>
                        columns={columns}
                        rows={(paginatedRenter as Renter[]) || []}
                        onDeselectAll={deselectAll}
                        onDeselectOne={(_, row) => {
                          deselectOne(row.id);
                        }}
                        onSelectAll={selectAll}
                        onSelectOne={(_, row) => {
                          selectOne(row.id);
                        }}
                        selected={selected}
                        isLoading={isLoading}
                        rowStartIcon={<User03 />}
                        selectable
                      />{" "}
                      {!rentersLoading && renters && renters.length === 0 && (
                        <Box sx={{ p: 3 }}>
                          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                            Es wurden noch keine Mieter angelegt
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box sx={{ p: 2 }}>
                      {isLoading ? (
                        <>
                          <MobileCardSkeleton />
                          <MobileCardSkeleton />
                        </>
                      ) : paginatedRenter && paginatedRenter.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                          Es wurden noch keine Mieter angelegt
                        </Typography>
                      ) : (
                        (paginatedRenter ?? []).map((renter) => <MobileRenterCard key={renter.id} renter={renter} />)
                      )}
                    </Box>
                  )}
                  <Divider />
                  <GeneralPagination
                    rowsPerPage={paginationState.rowsPerPage}
                    page={paginationState.page}
                    count={renters?.length ?? 0}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>{" "}
        <DeleteModal
          text={"Möchtest du wirklich den Mieter löschen? Mit den löschen des Mieters werden auch alle zugehörigen Mietverhältnisse gelöscht."}
          handleCancelDeleteModal={handleCancelDeleteModal}
          onDelete={handleDelete}
          openDeleteModal={openDeleteModal}
        />
      </RoleBasedGuard>
    </>
  );
}
