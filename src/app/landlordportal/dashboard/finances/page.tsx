"use client";

import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider, Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useRecoilValueLoadable } from "recoil";
import agent from "src/api/agent";
import { Seo } from "src/components/seo";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import React from "react";
import { rentPaymentsAtom } from "src/state/atoms/rentPayments";
import { RentPaymentFilters } from "src/sections/dashboard/finances/rent-payment-filters";
import { paths } from "src/paths";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { RentPayment } from "prisma/types/rentPayment";
import { PaidRents } from "src/sections/dashboard/finances/paid-rents";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Renters | Mieter | ${site.name}` } satisfies Metadata;

interface PageProps {
  searchParams: { sortDir?: "asc" | "desc" };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  const { sortDir } = searchParams;
  const settings = useSettings();

  const landlord = useRecoilValue(currentLandlordAtom);

  const rentPaymentsLoadable = useRecoilValueLoadable(rentPaymentsAtom);
  const refreshRentPayment = useRecoilRefresher_UNSTABLE(rentPaymentsAtom);

  const [isLoading, setIsLoading] = useState(false);

  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  useEffect(() => {
    if (landlord.id) {
      handleRefreshPayments();
    }
  }, [landlord]);

  // async function getRentPayments() {
  //   try {
  //     await agent.rentPayments.checkForNewTransactions(landlord.id);
  //     // setRentPayments("hasAccess" in landlord && landlord.rentPayments ? landlord.rentPayments : []);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function syncTransactions() {
    try {
      if (landlord.id) {
        const transactions = await agent.integrations.plaid.transactions.sync(landlord.id);
        return transactions;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRefreshPayments() {
    try {
      setIsLoading(true);
      const response = await syncTransactions();
      console.log(response);
      if (Array.isArray(response) && response.length > 0 && response.some((item) => item !== null && item !== undefined)) {
        refreshRentPayment();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  let sortedRentPayments: RentPayment[] = [];
  if (rentPaymentsLoadable.state === "hasValue") {
    const rentPayments = rentPaymentsLoadable.contents;
    sortedRentPayments = applySort(rentPayments, sortDir);
  }

  const paginatedRentPayments = useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return sortedRentPayments.slice(startIndex, endIndex);
  }, [sortedRentPayments, paginationState.page, paginationState.rowsPerPage]);

  return (
    <>
      <Seo title="Finanzen" />

      <RoleBasedGuard permission="/landlordportal/dashboard/finances">
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
                    <Typography variant="h4">Finanzen</Typography>
                  </div>
                </Stack>
              </Grid>
              <Grid xs={12} md={4}>
                <OverviewRentPaid showActions={false} />
              </Grid>
              <Grid xs={12} sx={{ pt: 3 }}>
                <Card>
                  <RentPaymentFilters
                    sortDir={sortDir}
                    path={paths.landlordportal.dashboard.finances.index}
                    handleRefreshPayments={handleRefreshPayments}
                    isLoadingPayments={isLoading || rentPaymentsLoadable.state === "loading"}
                  />
                  <Divider />{" "}
                  <Box sx={{ overflowX: "auto" }}>
                    <PaidRents rentPayments={paginatedRentPayments} isLoadingPayments={isLoading || rentPaymentsLoadable.state === "loading"} />
                  </Box>
                  <Divider />
                  <GeneralPagination
                    rowsPerPage={paginationState.rowsPerPage}
                    page={paginationState.page}
                    count={sortedRentPayments.length}
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
