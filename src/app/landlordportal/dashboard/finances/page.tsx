"use client";

import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid, Divider, Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import agent from "src/api/agent";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useSettings } from "src/hooks/use-settings";
import { OverviewRentPaid } from "src/sections/dashboard/overview/overview-rent-paid";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import React from "react";
import { useUser } from "src/hooks/use-user";
import { rentPaymentsAtom } from "src/state/atoms/rentPayments";
import { RentPaymentFilters } from "src/sections/dashboard/finances/rent-payment-filters";
import { paths } from "src/paths";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { RentPayment } from "prisma/types/rentPayment";
import { PaidRents } from "src/sections/dashboard/finances/paid-rents";
// import { site } from "src/config";
// import { Metadata } from "next/types";

// export const metadata = { title: `Renters | Mieter | ${site.name}` } satisfies Metadata;

interface PageProps {
  searchParams: { sortDir?: "asc" | "desc" };
}

export default function Page({ searchParams }: PageProps): React.JSX.Element {
  usePageView();

  const { sortDir } = searchParams;
  const settings = useSettings();
  const { user } = useUser();

  const setLandlord = useSetRecoilState(currentUserAtom);
  const landlord = useRecoilValue(currentUserAtom);

  const rentPaymentsLoadable = useRecoilValueLoadable(rentPaymentsAtom);

  const [isLoading, setIsLoading] = useState(false);

  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

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

  useEffect(() => {
    if (landlord.id) {
      getRentPayments();
    }
  }, [landlord]);

  async function getRentPayments() {
    try {
      await agent.rentPayments.checkForNewTransactions(landlord.id);
      // setRentPayments("hasAccess" in landlord && landlord.rentPayments ? landlord.rentPayments : []);
    } catch (error) {
      console.log(error);
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
                  <RentPaymentFilters sortDir={sortDir} path={paths.landlordportal.dashboard.finances.index} />
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
