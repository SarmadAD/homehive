"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CurrencyEur as CurrencyEurIcon } from "@phosphor-icons/react/dist/ssr/CurrencyEur";
import { ColumnDef, DataTable } from "src/components/data-table";
import { dayjs } from "src/lib/dayjs";
import { getRentPaidStatusPill } from "src/hooks/use-status-pill";
import { Renter } from "@prisma/client";
import { Button, IconButton, SvgIcon, Tooltip } from "@mui/material";
import { getRenterName } from "src/utils/get-renter-name";
import { getInitials } from "src/utils/get-initials";
import { RentPayment } from "prisma/types/rentPayment";
import agent from "src/api/agent";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { rentPaymentsAtom } from "src/state/atoms/rentPayments";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";

export type RentPaymentWithRenter = RentPayment & {
  renter: Renter;
};

export interface PaymentsProps {
  rentPayments: RentPayment[];
  isLoadingPayments: boolean;
}

export function PaidRents({ rentPayments = [], isLoadingPayments }: PaymentsProps): React.JSX.Element {
  const refreshRentPayment = useRecoilRefresher_UNSTABLE(rentPaymentsAtom);

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
