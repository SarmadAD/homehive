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
  AvatarGroup,
  Avatar,
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
import type { Page as PageType } from "src/types/page";
import { paths } from "src/paths";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import React from "react";
import { ColumnDef, DataTable } from "src/components/data-table";
import { Renter } from "prisma/types/renter";
import { RouterLink } from "src/components/router-link";
import { DotsVertical, User03, File02 } from "@untitled-ui/icons-react";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { toast } from "src/components/toaster";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import checkIfUserIsNotAllowedToCreateRenter from "src/utils/hasAccessForCreateRenter";
import { Landlord } from "prisma/types/landlord";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { rentalAgreementsAtom } from "src/state/atoms/rentalAgreementsAtom";
import { getInitials } from "src/utils/get-initials";
import { getRenterName } from "src/utils/get-renter-name";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Renters | Mieter | ${site.name}` } satisfies Metadata;

const useRentalAgreementIds = (rentalAgreements: RentalAgreement[] = []) => {
  return useMemo(() => {
    return rentalAgreements.length > 0 ? rentalAgreements.map((object) => object.id) : [];
  }, [rentalAgreements]);
};

export default function Page(): React.JSX.Element {
  const settings = useSettings();

  const setLandlord = useSetRecoilState(currentLandlordAtom);
  const landlordLoadable = useRecoilValueLoadable(currentLandlordAtom);
  const landlord = landlordLoadable.contents;
  const landloadLoading = landlordLoadable.state === "loading";

  const rentalAgreementsLoadable = useRecoilValueLoadable(rentalAgreementsAtom);
  const rentalAgreementsLoading = rentalAgreementsLoadable.state === "loading";
  const setRentalAgreements = useSetRecoilState(rentalAgreementsAtom);
  const rentalAgreements: RentalAgreement[] = rentalAgreementsLoadable.contents;
  const rentalAgreementsIds = useRentalAgreementIds(rentalAgreements);

  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(rentalAgreementsIds);

  // const rentersSelection = useSelection<string>(rentersIds);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Renter Menu Three Dots Menu
  // const [anchorElRenterThreeDotsMenu, setAnchorElRenterThreeDotsMenu] = React.useState<null | HTMLElement>(null);
  // const openRenterThreeDotsMenu = Boolean(anchorElRenterThreeDotsMenu);
  // const handleClickRenterThreeDotsMenu = (event: React.MouseEvent<HTMLButtonElement>, row: Renter) => {
  //   selectOne(row.id);
  //   setAnchorElRenterThreeDotsMenu(event.currentTarget);
  // };
  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  const isLoading = rentalAgreementsLoading || landloadLoading;

  // const handleCloseRenterThreeDotsMenu = () => {
  //   setAnchorElRenterThreeDotsMenu(null);
  //   deselectAll();
  // };

  // const handleDelete = async () => {
  //   try {
  //     const deletedRenter = await agent.renters.delete(Array.from(selected)[0]);
  //     const updatedRenters = renters.filter((renter) => renter.id !== deletedRenter.id);
  //     setRenters(updatedRenters);
  //     setLandlord((prevLandlord) => ({
  //       ...prevLandlord,
  //       renters: updatedRenters,
  //     }));
  //     toast.success("Mieter erfolgreich gelöscht");
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setOpenDeleteModal(false);
  //   }
  // };

  // function handleDeleteModalOpen() {
  //   setAnchorElRenterThreeDotsMenu(null);
  //   setOpenDeleteModal(true);
  // }

  // function handleCancelDeleteModal() {
  //   setOpenDeleteModal(false);
  //   deselectAll();
  // }

  const paginatedRentalAgreements = useMemo(() => {
    if (rentalAgreementsLoadable.state === "hasValue") {
      const startIndex = paginationState.page * paginationState.rowsPerPage;
      const endIndex = startIndex + paginationState.rowsPerPage;
      return rentalAgreements.slice(startIndex, endIndex);
    }
  }, [rentalAgreements, paginationState.page, paginationState.rowsPerPage]);

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Typography variant="subtitle2">{row.rentalObject?.name || "Unbekanntes Objekt"}</Typography>
        </div>
      ),
      name: "Objekt",
      // width: "150px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {row.renter ? (
            <Tooltip key={getRenterName(row.renter.firstname, row.renter.surname)} title={getRenterName(row.renter.firstname, row.renter.surname)}>
              <Avatar sx={{ bgcolor: "#8a94a6", height: 42, width: 42 }}>
                {getInitials(getRenterName(row.renter.firstname, row.renter.surname))}
              </Avatar>
            </Tooltip>
          ) : (
            <Tooltip title="Unbekannter Mieter">
              <Avatar sx={{ bgcolor: "#8a94a6", height: 42, width: 42 }}>?</Avatar>
            </Tooltip>
          )}
          <div>
            <Typography variant="subtitle2">{row.renter ? getRenterName(row.renter.firstname, row.renter.surname) : "Unbekannter Mieter"}</Typography>
            <Typography color="text.secondary" variant="body2">
              {row.renter?.email ?? ""}
            </Typography>
          </div>
        </Stack>
      ),
      name: "Mieter",
      // width: "250px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Link component={RouterLink} href={`${paths.landlordportal.dashboard.renters.details}${encodeURIComponent(row.renter?.id ?? "")}`}>
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          </Link>
        </div>
      ),
      name: "",
      align: "right",
    },
  ] satisfies ColumnDef<RentalAgreement>[];

  return (
    <>
      <Seo title="Mietverhältnisse" />
      <RoleBasedGuard permission="/landlordportal/dashboard/rentalagreements">
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
                    <Typography variant="h4">Mietverhältnisse</Typography>
                  </div>
                  <Stack direction="row" spacing={4}>
                    <span>
                      <Button
                        component={RouterLink}
                        startIcon={
                          <SvgIcon>
                            <PlusIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                        href={paths.landlordportal.dashboard.rentalagreements.create}
                      >
                        Hinzufügen
                      </Button>{" "}
                    </span>
                  </Stack>
                </Stack>
              </Grid>

              <Grid xs={12} sx={{ pt: 3 }}>
                <Card>
                  <DataTable<RentalAgreement>
                    columns={columns}
                    rows={(paginatedRentalAgreements as RentalAgreement[]) || []}
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
                    rowStartIcon={<File02 />}
                    selectable
                  />{" "}
                  {!rentalAgreements.length && !isLoading ? (
                    <Box sx={{ p: 3 }}>
                      <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                        Es wurden noch keine Mietverhältnisse angelegt
                      </Typography>
                    </Box>
                  ) : null}
                  <Divider />
                  <GeneralPagination
                    rowsPerPage={paginationState.rowsPerPage}
                    page={paginationState.page}
                    count={rentalAgreements.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                  />
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>{" "}
      </RoleBasedGuard>
    </>
  );
}
