"use client";

import { useMemo } from "react";
import { useEffect, useState, MouseEvent } from "react";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import { Avatar, Box, Button, Container, Divider, Link, Stack, SvgIcon, Typography, Grid, Menu, MenuItem, Skeleton, Card } from "@mui/material";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { getInitials } from "src/utils/get-initials";
import { RenterBasicDetails } from "src/sections/dashboard/renter/renter-basic-details";
import { useSearchParams } from "next/navigation";
import { selectedRenterIdAtom } from "src/state/atoms/selectedRenterIdAtom";
import { renterAtom } from "src/state/atoms/renterAtom";
import { getRenterName } from "src/utils/get-renter-name";
import { DeleteOutline } from "@mui/icons-material";
import agent from "src/api/agent";
import { useRouter } from "src/hooks/use-router";
import { PaidRents } from "src/sections/dashboard/renter/paid-rents";
import { RentPayment } from "@prisma/client";
import { RentPaymentFilters } from "src/sections/dashboard/finances/rent-payment-filters";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { rentPaymentsAtom } from "src/state/atoms/rentPayments";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { toast } from "src/components/toaster";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { RenterRentalAgreementInfos } from "src/sections/dashboard/renter/renter-rental-agreement-infos";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { renterAtomWithRenterId } from "src/state/atoms/renterAtomWithRenterId";
import { deleteRenterAtom } from "src/state/atoms/deleteRenterAtom";

const tabs = [{ label: "Details", value: "details" }];

interface PageProps {
  searchParams: { sortDir?: "asc" | "desc"; renterId: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { sortDir } = searchParams;
  const router = useRouter();
  const customSearchParams = useSearchParams();
  const renterId = customSearchParams.get("renterId");

  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  const [{ isLoading: landloadLoading, isError: landlordError, data: landlord }] = useAtom(currentLandlordAtom);
  const [{ isLoading: renterLoading, isError: renterError, data: renter }] = useAtom(renterAtomWithRenterId);
  const [{ isLoading: rentPaymentsLoading, isError: rentPaymentsError, data: rentPayments }] = useAtom(rentPaymentsAtom);

  const setSelectedRenterIdAtom = useSetAtom(selectedRenterIdAtom);
  const { data: renters } = useAtomValue(rentersAtom);
  const [{ mutateAsync: deleteRenter }] = useAtom(deleteRenterAtom);

  const [openDeleteModalForRenter, setOpenDeleteModalForRenter] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function setRenterId() {
    if (renterId) {
      setSelectedRenterIdAtom(renterId.toString() ?? "");
    }
  }

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleDeleteClick = async () => {
  //   try {
  //     if (renter?.id) {
  //       await agent.renters.delete(renter.id);
  //       router.push("/landlordportal/dashboard/renters");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setAnchorEl(null);
  //   }
  // };

  useEffect(() => {
    setRenterId();
  }, []);

  // --After when using plaid again
  // useEffect(() => {
  //   if (landlord.id && renterId) {
  //     handleRefreshPayments();
  //   }
  // }, [landlord]);

  // async function getRentPayments() {
  //   try {
  //     await agent.rentPayments.checkForNewTransactionsForRenter(landlord.id, renterId ?? "");
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //   }
  // }

  // async function syncTransactions() {
  //   try {
  //     if (landlord?.id) {
  //       const transactions = await agent.integrations.plaid.transactions.sync(landlord?.id);
  //       return transactions;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function handleRefreshPayments() {
  //   try {
  //     setIsLoading(true);
  //     const response = await syncTransactions();
  //     if (Array.isArray(response) && response.length > 0 && response.some((item) => item !== null && item !== undefined)) {
  //       refreshRentPayment();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  // --After when using plaid again

  function applySort(rentPayments: RentPayment[], sortDir: "asc" | "desc" | undefined): RentPayment[] {
    const paymentsCopy = [...rentPayments];

    return paymentsCopy.sort((a, b) => {
      const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
      const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;

      if (sortDir === "asc") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });
  }

  function handleDeleteModalOpenForRenter() {
    setAnchorEl(null);
    setOpenDeleteModalForRenter(true);
  }

  function handleCancelDeleteRenterFromRentalObjectModal() {
    setOpenDeleteModalForRenter(false);
  }

  const handleDeleteRenter = async () => {
    try {
      await deleteRenter(renterId ?? "");
      router.push(paths.landlordportal.dashboard.renters.index);
      toast.success("Mieter erfolgreich gelöscht");
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDeleteModalForRenter(false);
    }
  };

  const isLoadingPaymentsAll = rentPaymentsLoading || isLoading || renterLoading;

  let sortedRentPayments: RentPayment[] = [];
  if (!isLoadingPaymentsAll) {
    const filteredRentPayments = rentPayments?.filter((rentPayment) => rentPayment.renterId === renterId);
    sortedRentPayments = applySort(filteredRentPayments ?? [], sortDir);
  }

  const paginatedRentPayments = useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return sortedRentPayments.slice(startIndex, endIndex);
  }, [sortedRentPayments, paginationState.page, paginationState.rowsPerPage]);

  // const handleTabsChange = useCallback((event: ChangeEvent<{}>, value: string): void => {
  //   setCurrentTab(value);
  // }, []);

  return (
    <>
      <Seo title="Mieterinformation" />
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
          position: "relative",
        }}
      >
        <Box
          sx={{
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={4}>
              <Stack spacing={4}>
                <div>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon>
                        <ArrowLeftIcon />
                      </SvgIcon>
                    }
                    onClick={() => {
                      if (window.history.length > 2) {
                        router.back();
                      } else {
                        router.push(paths.landlordportal.dashboard.renters.index);
                      }
                    }}
                    sx={{
                      alignItems: "center",
                      display: "inline-flex",
                      textTransform: "none",
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    <Typography variant="subtitle2">Zurück</Typography>
                  </Button>
                </div>
                <Stack
                  alignItems="flex-start"
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Stack alignItems="center" direction="row" spacing={2}>
                    {renter?.image || renter?.surname || renter?.firstname ? (
                      <Avatar
                        src={renter.image}
                        sx={{
                          height: 64,
                          width: 64,
                        }}
                      >
                        {getInitials(getRenterName(renter.firstname, renter.surname))}
                      </Avatar>
                    ) : (
                      <Skeleton variant="circular" width={64} height={64} />
                    )}

                    <Stack spacing={1}>
                      {renter?.firstname || renter?.surname ? (
                        <div>
                          <Typography variant="h4">{getRenterName(renter?.firstname, renter?.surname)}</Typography>
                          <Typography color="text.secondary" variant="body1">
                            {renter?.email}
                          </Typography>
                        </div>
                      ) : (
                        <div>
                          <Skeleton width={150} height={32} />
                          <Skeleton width={150} height={22} />
                        </div>
                      )}
                    </Stack>
                  </Stack>
                  <Stack alignItems="center" direction="row" spacing={2}>
                    {/* <Button
                      color="inherit"
                      component={RouterLink}
                      endIcon={
                        <SvgIcon>
                          <Edit02Icon />
                        </SvgIcon>
                      }
                      href={paths.landlordportal.dashboard.objects.edit}
                    >
                      Edit
                    </Button> */}
                    <Button
                      endIcon={
                        <SvgIcon>
                          <ChevronDownIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                      onClick={handleMenuOpen}
                    >
                      Aktionen
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: {
                          maxHeight: 48 * 4.5,
                        },
                      }}
                    >
                      <MenuItem onClick={() => handleDeleteModalOpenForRenter()}>
                        <SvgIcon>
                          <DeleteOutline />
                        </SvgIcon>
                        Löschen
                      </MenuItem>
                    </Menu>
                  </Stack>
                </Stack>
                {/* <div>
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    sx={{ mt: 3 }}
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                  >
                    {tabs.map((tab) => (
                      <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                  </Tabs>
                  <Divider />
                </div> */}
              </Stack>
              {/* {currentTab === "details" && ( */}
              <div>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, lg: 4 }}>
                    <RenterBasicDetails />
                    <RenterRentalAgreementInfos />
                  </Grid>
                  <Grid size={{ lg: 8, xs: 12 }}>
                    <Card>
                      <RentPaymentFilters
                        sortDir={sortDir}
                        showFilters={false}
                        path={`${paths.landlordportal.dashboard.renters.details}${renterId}`}
                        // handleRefreshPayments={handleRefreshPayments}
                        isLoadingPayments={isLoadingPaymentsAll}
                      />
                      <Divider />{" "}
                      <Box sx={{ overflowX: "auto" }}>
                        <PaidRents rentPayments={paginatedRentPayments} isLoading={isLoadingPaymentsAll} />
                      </Box>
                      <Divider />
                      <GeneralPagination
                        rowsPerPage={paginationState.rowsPerPage}
                        page={paginationState.page}
                        count={paginatedRentPayments.length}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                      />
                    </Card>
                  </Grid>
                </Grid>
              </div>
              {/* )} */}
            </Stack>
          </Container>
        </Box>{" "}
        <DeleteModal
          text={"Möchtest Du wirklich den Mieter löschen?"}
          handleCancelDeleteModal={handleCancelDeleteRenterFromRentalObjectModal}
          onDelete={handleDeleteRenter}
          openDeleteModal={openDeleteModalForRenter}
        />
      </Box>
    </>
  );
}
