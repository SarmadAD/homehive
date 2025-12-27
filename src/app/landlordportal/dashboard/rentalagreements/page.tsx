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
  Card,
  Divider,
  Tooltip,
  Avatar,
  useMediaQuery,
  Theme,
  CardContent,
  List,
  ListItem,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Seo } from "src/components/seo";
import { useSelection } from "src/hooks/use-selection";
import { useSettings } from "src/hooks/use-settings";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { paths } from "src/paths";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import React from "react";
import { ColumnDef, DataTable } from "src/components/data-table";
import { RouterLink } from "src/components/router-link";
import { File02 } from "@untitled-ui/icons-react";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { Landlord } from "prisma/types/landlord";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { rentalAgreementsAtom } from "src/state/atoms/rentalAgreementsAtom";
import { getInitials } from "src/utils/get-initials";
import { getRenterName } from "src/utils/get-renter-name";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import checkIfUserIsNotAllowedToCreateRentalAgreement from "src/utils/hasAccessForCreateRentalAgreement";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { MobileCardSkeleton } from "src/skeleton/dashboard-skeletons";
import { useAtom } from "jotai";
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

  const [{ isLoading: landloadLoading, isError: landlordError, data: landlord }] = useAtom(currentLandlordAtom);
  const [{ isLoading: rentalAgreementsLoading, isError: rentalAgreementsError, data: rentalAgreements }] = useAtom(rentalAgreementsAtom);

  const rentalAgreementsIds = useRentalAgreementIds(rentalAgreements);

  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(rentalAgreementsIds);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

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
    if (rentalAgreements) {
      const startIndex = paginationState.page * paginationState.rowsPerPage;
      const endIndex = startIndex + paginationState.rowsPerPage;
      return rentalAgreements?.slice(startIndex, endIndex);
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

  function MobileRentalAgreementCard({ agreement }: { agreement: RentalAgreement }) {
    return (
      <Box sx={{ mb: 2 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center">
                  <SvgIcon>
                    <File02 />
                  </SvgIcon>
                  <Typography variant="subtitle2">Mietverhältnis</Typography>
                </Stack>
                <Button
                  component={RouterLink}
                  href={`${paths.landlordportal.dashboard.renters.details}${agreement.renter?.id ?? ""}`}
                  size="small"
                  color="primary"
                  sx={{ minWidth: 0, p: 1 }}
                  aria-label="Mieter anzeigen"
                >
                  <SvgIcon>
                    <EyeIcon />
                  </SvgIcon>
                </Button>
              </Stack>
              <List sx={{ "& .MuiListItem-root": { justifyContent: "space-between", px: 0, py: 1 } }}>
                <ListItem divider>
                  <Typography variant="subtitle2">Mieter</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {agreement.renter ? getRenterName(agreement.renter.firstname, agreement.renter.surname) : "Unbekannter Mieter"}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="subtitle2">Objekt</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {agreement.rentalObject?.name || "Unbekanntes Objekt"}
                  </Typography>
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
            <Grid container>
              <Grid size={{ xs: 12 }} pb={3}>
                <Stack direction={{ xs: "column", sm: "row", md: "row" }} justifyContent="space-between" spacing={4}>
                  <div>
                    <Typography variant="h4">Mietverhältnisse</Typography>
                  </div>
                  <Stack direction="row" spacing={4}>
                    <Tooltip
                      title={
                        checkIfUserIsNotAllowedToCreateRentalAgreement(landlord as Landlord) ? (
                          <>
                            Mehr Mietverhältnisse anlegen?{" "}
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
                          href={paths.landlordportal.dashboard.rentalagreements.create}
                          disabled={checkIfUserIsNotAllowedToCreateRentalAgreement(landlord as Landlord)}
                        >
                          Hinzufügen
                        </Button>{" "}
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ pt: 3 }}>
                <Card>
                  {!isMobile ? (
                    <>
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
                      {!rentalAgreementsLoading && rentalAgreements && rentalAgreements.length === 0 && (
                        <Box sx={{ p: 3 }}>
                          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                            Es wurden noch keine Mietverhältnisse angelegt
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
                      ) : !paginatedRentalAgreements || paginatedRentalAgreements.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                          Es wurden noch keine Mietverhältnisse angelegt
                        </Typography>
                      ) : (
                        (paginatedRentalAgreements ?? []).map((agreement) => <MobileRentalAgreementCard key={agreement.id} agreement={agreement} />)
                      )}
                    </Box>
                  )}
                  <Divider />
                  {/* Pagination nur im Desktop-View */}
                  {!isMobile && (
                    <GeneralPagination
                      rowsPerPage={paginationState.rowsPerPage}
                      page={paginationState.page}
                      count={rentalAgreements?.length ?? 0}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                    />
                  )}
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>{" "}
      </RoleBasedGuard>
    </>
  );
}
