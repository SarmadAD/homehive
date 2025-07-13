"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ColumnDef, DataTable } from "src/components/data-table";
import { dayjs } from "src/lib/dayjs";
import { getRentPaidStatusPill } from "src/hooks/use-status-pill";
import { Renter } from "@prisma/client";
import { IconButton, List, ListItem, SvgIcon, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { getRenterName } from "src/utils/get-renter-name";
import { getInitials } from "src/utils/get-initials";
import { RentPayment } from "prisma/types/rentPayment";
import agent from "src/api/agent";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { rentPaymentsAtom } from "src/state/atoms/rentPayments";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import { MobileCardSkeleton } from "src/skeleton/dashboard-skeletons";

export type RentPaymentWithRenter = RentPayment & {
  renter: Renter;
};

export interface PaymentsProps {
  rentPayments: RentPayment[];
  isLoadingPayments: boolean;
}

function MobileRentPaymentCard({ rentPayment, onAction }: { rentPayment: RentPaymentWithRenter; onAction: (rentPayment: RentPayment) => void }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            {/* Titelzeile mit Datum und Aktion */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">{dayjs(rentPayment.paymentDate).format("DD. MMMM YYYY")}</Typography>
              <Tooltip title={rentPayment.status === "PAID" ? "Markiere als nicht bezahlt" : "Markiere als bezahlt"}>
                <IconButton color={rentPayment.status === "PAID" ? "error" : "success"} onClick={() => onAction(rentPayment)} size="small">
                  <SvgIcon sx={{ fontSize: 28 }}>{rentPayment.status === "PAID" ? <XIcon /> : <CheckIcon />}</SvgIcon>
                </IconButton>
              </Tooltip>
            </Stack>
            {/* Felder als List, Werte immer rechts */}
            <List sx={{ "& .MuiListItem-root": { px: 0, py: 1 } }}>
              <ListItem
                divider
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Mieter</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ textAlign: "right" }}>
                  {getRenterName(rentPayment.renter.firstname, rentPayment.renter.surname)}
                </Typography>
              </ListItem>
              <ListItem
                divider
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Miete</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ textAlign: "right" }}>
                  {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(rentPayment.paymentAmount)}
                </Typography>
              </ListItem>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Status</Typography>
                <Box sx={{ textAlign: "right" }}>{getRentPaidStatusPill(rentPayment.status)}</Box>
              </ListItem>
            </List>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export function PaidRents({ rentPayments = [], isLoadingPayments }: PaymentsProps): React.JSX.Element {
  const refreshRentPayment = useRecoilRefresher_UNSTABLE(rentPaymentsAtom);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  async function markPaymentAsPaid(rentPayment: RentPayment) {
    try {
      await agent.rentPayments.update(rentPayment.id);
      refreshRentPayment();
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {dayjs(row.paymentDate).format("DD. MMMM YYYY")}
        </Typography>
      ),
      name: "Datum",
      align: "left",
    },
    {
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="subtitle2">
          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(row.paymentAmount)}
        </Typography>
      ),
      name: "Miete",
      // width: "200px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Tooltip key={getRenterName(row.renter.firstname, row.renter.surname)} title={getRenterName(row.renter.firstname, row.renter.surname)}>
            <Avatar sx={{ bgcolor: "#8a94a6", height: 42, width: 42 }}>{getInitials(getRenterName(row.renter.firstname, row.renter.surname))}</Avatar>
          </Tooltip>
          <div>
            <Typography variant="subtitle2">{getRenterName(row.renter.firstname, row.renter.surname)}</Typography>
            <Typography color="text.secondary" variant="body2">
              {row.renter.email}
            </Typography>
          </div>
        </Stack>
      ),
      name: "Mieter",
      // width: "250px",
    },
    {
      formatter: (row): React.JSX.Element => {
        const rentPaymentStatus = getRentPaidStatusPill(row.status);
        return rentPaymentStatus;
      },
      name: "Status",
      // width: "200px",
    },
    {
      formatter: (row): React.JSX.Element => (
        <Tooltip title={row.status === "PAID" ? "Markiere als nicht bezahlt" : "Markiere als bezahlt"}>
          <IconButton color={row.status === "PAID" ? "error" : "success"} onClick={() => markPaymentAsPaid(row)}>
            <SvgIcon sx={{ fontSize: 28 }}>{row.status === "PAID" ? <XIcon /> : <CheckIcon />}</SvgIcon>
          </IconButton>
        </Tooltip>
      ),
      name: "Aktion",
    },
  ] satisfies ColumnDef<RentPayment>[];

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        {isLoadingPayments ? (
          <>
            <MobileCardSkeleton />
            <MobileCardSkeleton />
            <MobileCardSkeleton />
          </>
        ) : !rentPayments.length ? (
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            Es wurden noch keine Mieten bezahlt
          </Typography>
        ) : (
          rentPayments.map((rentPayment) => (
            <MobileRentPaymentCard key={rentPayment.id} rentPayment={rentPayment as RentPaymentWithRenter} onAction={markPaymentAsPaid} />
          ))
        )}
      </Box>
    );
  }
  return (
    <React.Fragment>
      <DataTable<RentPayment> columns={columns} rows={rentPayments} isLoading={isLoadingPayments} />{" "}
      {!rentPayments.length && !isLoadingPayments ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            Es wurden noch keine Mieten bezahlt
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
