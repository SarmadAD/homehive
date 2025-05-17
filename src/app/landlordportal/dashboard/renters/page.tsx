"use client";

import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  SvgIcon,
  Link,
  Menu,
  MenuItem,
  Card,
  Divider,
  Tooltip,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import agent from "src/api/agent";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useRentersSearch } from "src/hooks/use-renter-search";
import { useRentersIds } from "src/hooks/use-renters-ids";
import { useSelection } from "src/hooks/use-selection";
import { useSettings } from "src/hooks/use-settings";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import type { Page as PageType } from "src/types/page";
import { paths } from "src/paths";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import React from "react";
import { ColumnDef, DataTable } from "src/components/data-table";
import { Renter } from "prisma/types/renter";
import { RouterLink } from "src/components/router-link";
import { DotsVertical, User03 } from "@untitled-ui/icons-react";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { toast } from "src/components/toaster";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import checkIfUserIsNotAllowedToCreateRenter from "src/utils/hasAccessForCreateRenter";
import { Landlord } from "prisma/types/landlord";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Renters | Mieter | ${site.name}` } satisfies Metadata;

const Page: PageType = () => {
  usePageView();
  const settings = useSettings();

  const setLandlord = useSetRecoilState(currentLandlordAtom);
  const landlordLoadable = useRecoilValueLoadable(currentLandlordAtom);
  const landlord = landlordLoadable.contents;
  const landloadLoading = landlordLoadable.state === "loading";
  const rentersSearch = useRentersSearch();
  const renters = useRecoilValue(rentersAtom);
  const setRenters = useSetRecoilState(rentersAtom);
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

  const handleCloseRenterThreeDotsMenu = () => {
    setAnchorElRenterThreeDotsMenu(null);
    deselectAll();
  };

  const handleDelete = async () => {
    try {
      const deletedRenter = await agent.renters.delete(Array.from(selected)[0]);
      const updatedRenters = renters.filter((renter) => renter.id !== deletedRenter.id);
      setRenters(updatedRenters);
      setLandlord((prevLandlord) => ({
        ...prevLandlord,
        renters: updatedRenters,
      }));
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
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return renters.slice(startIndex, endIndex);
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
            <Grid container disableEqualOverflow>
              <Grid xs={12} pb={3}>
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
              <Grid xs={12} md={4}>
                <OverviewRentPaid showActions={false} />
              </Grid>
              <Grid xs={12} sx={{ pt: 3 }}>
                <Card>
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
                    isLoading={landloadLoading}
                    rowStartIcon={<User03 />}
                    selectable
                  />{" "}
                  {!renters.length && !landloadLoading ? (
                    <Box sx={{ p: 3 }}>
                      <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                        Es wurden noch keine Mieter angelegt
                      </Typography>
                    </Box>
                  ) : null}
                  <Divider />
                  <GeneralPagination
                    rowsPerPage={paginationState.rowsPerPage}
                    page={paginationState.page}
                    count={renters.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>{" "}
        <DeleteModal
          text={"Möchtest du wirklich den Mieter löschen?"}
          handleCancelDeleteModal={handleCancelDeleteModal}
          onDelete={handleDelete}
          openDeleteModal={openDeleteModal}
        />
      </RoleBasedGuard>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
