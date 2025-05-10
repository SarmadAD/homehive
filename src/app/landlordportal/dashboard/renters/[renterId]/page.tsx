"use client";

import { ChangeEvent, useMemo } from "react";
import { useCallback, useEffect, useState, MouseEvent } from "react";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
  Menu,
  MenuItem,
  Skeleton,
  Card,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";
import { getInitials } from "src/utils/get-initials";
import { RenterBasicDetails } from "src/sections/dashboard/renter/renter-basic-details";
import { useSearchParams } from "next/navigation";
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { selectedRenterIdAtom } from "src/state/atoms/selectedRenterIdAtom";
import { renterAtom } from "src/state/atoms/renterAtom";
import { getRenterName } from "src/utils/get-renter-name";
import { DeleteOutline } from "@mui/icons-material";
import agent from "src/api/agent";
import { useRouter } from "src/hooks/use-router";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { useUser } from "src/hooks/use-user";
import { PaidRents } from "src/sections/dashboard/renter/paid-rents";
import { RentPayment } from "@prisma/client";
import { RentPaymentFilters } from "src/sections/dashboard/finances/rent-payment-filters";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { rentPaymentsAtom } from "src/state/atoms/rentPayments";

const tabs = [{ label: "Details", value: "details" }];

interface PageProps {
  searchParams: { sortDir?: "asc" | "desc"; renterId: string };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  // const [currentTab, setCurrentTab] = useState<string>("details");

  const router = useRouter();
  const { user } = useUser();

  const { sortDir, renterId } = searchParams;

  // const searchParams = useSearchParams();
  // const renterId = searchParams?.get("renterId");

  const renter = useRecoilValue(renterAtom);
  // const searchParams = useSearchParams();
  const setLandlord = useSetRecoilState(currentUserAtom);
  const setSelectedRenterIdAtom = useSetRecoilState(selectedRenterIdAtom);
  const landlord = useRecoilValue(currentUserAtom);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const rentPaymentsLoadable = useRecoilValueLoadable(rentPaymentsAtom);

  const [isLoading, setIsLoading] = useState(false);
  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  const renterLoadable = useRecoilValueLoadable(renterAtom);

  usePageView();

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLandlord() {
    try {
      setIsLoading(true);
      const authenticatedUserId = user?.id;
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
        setLandlord(landlord);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

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

  const handleDeleteClick = async () => {
    try {
      if (renter?.id) {
        await agent.renters.delete(renter.id);
        router.push("/landlordportal/dashboard/renters");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAnchorEl(null);
    }
  };

  useEffect(
    () => {
      setRenterId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (landlord.id && renterId) {
      getRentPayments();
    }
  }, [landlord]);

  async function getRentPayments() {
    try {
      await agent.rentPayments.checkForNewTransactionsForRenter(landlord.id, renterId ?? "");
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

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

  const isLoadingPaymentsAll =
    rentPaymentsLoadable.state === "loading" ||
    renterLoadable.state === "loading" ||
    (renterLoadable.state === "hasValue" && renterLoadable.contents.id === "");

  let sortedRentPayments: RentPayment[] = [];
  if (!isLoadingPaymentsAll && rentPaymentsLoadable.state === "hasValue") {
    const rentPayments = rentPaymentsLoadable.contents.filter((rentPayment) => rentPayment.renterId === renterId);
    sortedRentPayments = applySort(rentPayments, sortDir);
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
      <Seo title="Objekt Details" />
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
          overflow: "hidden",
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
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.landlordportal.dashboard.renters.index}
                    sx={{
                      alignItems: "center",
                      display: "inline-flex",
                    }}
                    underline="hover"
                  >
                    <SvgIcon sx={{ mr: 1 }}>
                      <ArrowLeftIcon />
                    </SvgIcon>
                    <Typography variant="subtitle2">Mieter</Typography>
                  </Link>
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
                      {renter?.firstname || renter.surname ? (
                        <div>
                          <Typography variant="h4">{getRenterName(renter.firstname, renter.surname)}</Typography>
                          <Typography color="text.secondary" variant="body1">
                            {renter.email}
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
                      <MenuItem onClick={handleDeleteClick}>
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
                  <Grid xs={12} lg={4}>
                    <RenterBasicDetails />
                  </Grid>
                  <Grid lg={8} xs={12}>
                    <Card>
                      <RentPaymentFilters sortDir={sortDir} path={`${paths.landlordportal.dashboard.renters.details}${renterId}`} />
                      <Divider />{" "}
                      <Box sx={{ overflowX: "auto" }}>
                        <PaidRents rentPayments={paginatedRentPayments} isLoadingPayments={isLoadingPaymentsAll} />
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
        </Box>
      </Box>
    </>
  );
}
