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
  Menu,
  MenuItem,
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
import { DotsVertical, File02 } from "@untitled-ui/icons-react";
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
import { Pen as PenIcon } from "@phosphor-icons/react/dist/ssr/Pen";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { MobileCardSkeleton } from "src/skeleton/dashboard-skeletons";
import { useAtom } from "jotai";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { useRouter } from "src/hooks/use-router";
import { deleteRentalAgreementAtom } from "src/state/atoms/deleteRentalAgreementAtom";
import { toast } from "src/components/toaster";

// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Renters | Mieter | ${site.name}` } satisfies Metadata;

const useRentalAgreementIds = (rentalAgreements: RentalAgreement[] = []) => {
  return useMemo(() => {
    return rentalAgreements.length > 0 ? rentalAgreements.map((rentalAgreement) => rentalAgreement.id) : [];
  }, [rentalAgreements]);
};

export default function Page(): React.JSX.Element {
  const settings = useSettings();
  const router = useRouter();

  const [{ isLoading: landloadLoading, data: landlord }] = useAtom(currentLandlordAtom);
  const [{ isLoading: rentalAgreementsLoading, data: rentalAgreements }] = useAtom(rentalAgreementsAtom);
  const [{ mutateAsync: deleteRentalAgreement }] = useAtom(deleteRentalAgreementAtom);

  const rentalAgreementsIds = useRentalAgreementIds(rentalAgreements);

  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(rentalAgreementsIds);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  const isLoading = rentalAgreementsLoading || landloadLoading;
  const [anchorElRentalAgreementThreeDotsMenu, setAnchorElRentalAgreementThreeDotsMenu] = useState<null | HTMLElement>(null);
  const openRentalAgreementThreeDotsMenu = Boolean(anchorElRentalAgreementThreeDotsMenu);

  const handleClickRentalAgreementThreeDotsMenu = (event: React.MouseEvent<HTMLButtonElement>, row: RentalAgreement) => {
    selectOne(row.id);
    setAnchorElRentalAgreementThreeDotsMenu(event.currentTarget);
  };

  const handleCloseRentalAgreementThreeDotsMenu = () => {
    setAnchorElRentalAgreementThreeDotsMenu(null);
    deselectAll();
  };

  async function handleDelete() {
    try {
      await deleteRentalAgreement(Array.from(selected)[0]);
      toast.success("Mietverhältnis erfolgreich gelöscht");
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDeleteModal(false);
    }
  }

  function handleEditRentalAgreement() {
    setAnchorElRentalAgreementThreeDotsMenu(null);
    router.push(`${paths.landlordportal.dashboard.rentalagreements.edit}${Array.from(selected)[0]}`);
  }

  function handleDeleteModalOpen() {
    setAnchorElRentalAgreementThreeDotsMenu(null);
    setOpenDeleteModal(true);
  }

  function handleCancelDeleteModal() {
    setOpenDeleteModal(false);
    deselectAll();
  }

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
      key: "rentalObjectName",
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
      key: "renterName",
      name: "Mieter",
      // width: "250px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Button
            size="small"
            sx={{
              minWidth: 0,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-controls={openRentalAgreementThreeDotsMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openRentalAgreementThreeDotsMenu ? "true" : undefined}
            onClick={(event) => handleClickRentalAgreementThreeDotsMenu(event, row)}
          >
            <SvgIcon>
              <DotsVertical />
            </SvgIcon>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorElRentalAgreementThreeDotsMenu}
            open={openRentalAgreementThreeDotsMenu}
            onClose={handleCloseRentalAgreementThreeDotsMenu}
            slotProps={{ list: { "aria-labelledby": "basic-button" } }}
          >
            <MenuItem onClick={() => handleEditRentalAgreement()}>Bearbeiten</MenuItem>
            <MenuItem onClick={() => handleDeleteModalOpen()}>Löschen</MenuItem>
          </Menu>
          <Link
            component={RouterLink}
            href={`${paths.landlordportal.dashboard.renters.details}${encodeURIComponent(row.renter?.id ?? "")}`}
            sx={{
              display: "flex",
              alignItems: "center",
              minHeight: 40,
            }}
          >
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          </Link>
        </div>
      ),
      width: "0px",
      name: "",
      key: "goToRenterLink",
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
                <div>
                  <Button
                    component={RouterLink}
                    href={`${paths.landlordportal.dashboard.renters.details}${agreement.renter?.id ?? ""}`}
                    size="small"
                    color="primary"
                    sx={{ minWidth: 0, p: 1 }}
                    aria-label="Mietverhältnis anzeigen"
                  >
                    <SvgIcon>
                      <EyeIcon />
                    </SvgIcon>
                  </Button>{" "}
                  <Button
                    component={RouterLink}
                    href={`${paths.landlordportal.dashboard.rentalagreements.edit}${agreement.id}`}
                    size="small"
                    color="primary"
                    sx={{ minWidth: 0, p: 1 }}
                    aria-label="Mietverhältnis bearbeiten"
                  >
                    <SvgIcon>
                      <PenIcon />
                    </SvgIcon>
                  </Button>{" "}
                  <Button
                    component={RouterLink}
                    href=""
                    onClick={() => {
                      handleDeleteModalOpen();
                    }}
                    size="small"
                    color="error"
                    sx={{ minWidth: 0, p: 1 }}
                    aria-label="Mietverhältnis löschen"
                  >
                    <SvgIcon>
                      <TrashIcon />
                    </SvgIcon>
                  </Button>
                </div>
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
              <Grid size={{ xs: 12 }}>
                <Stack direction="row" flexWrap="wrap" justifyContent="space-between" spacing={4}>
                  <div>
                    <Typography variant="h4" sx={{ flexShrink: 0 }}>
                      Mietverhältnisse
                    </Typography>
                  </div>
                  <Box sx={{ ml: "auto" }}>
                    <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={4} sx={{ width: "100%" }}>
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
                  </Box>
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
        </Box>
        <DeleteModal
          text={"Bist Du sicher, dass Du dieses Mietverhältnis dauerhaft löschen möchtest?" + " Dieser Vorgang kann nicht rückgängig gemacht werden."}
          handleCancelDeleteModal={handleCancelDeleteModal}
          onDelete={handleDelete}
          openDeleteModal={openDeleteModal}
        />
      </RoleBasedGuard>
    </>
  );
}
