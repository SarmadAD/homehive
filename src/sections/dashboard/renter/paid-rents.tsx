"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ColumnDef, DataTable } from "src/components/data-table";
import { dayjs } from "src/lib/dayjs";
import { getRentPaidStatusPill } from "src/hooks/use-status-pill";
import { RentPayment } from "@prisma/client";

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
    formatter: (row): React.JSX.Element => {
      const rentPaymentStatus = getRentPaidStatusPill(row.status);
      return rentPaymentStatus;
    },
    name: "Status",
    // width: "200px",
  },
] satisfies ColumnDef<RentPayment>[];

export interface PaymentsProps {
  rentPayments: RentPayment[];
  isLoadingPayments: boolean;
}

export function PaidRents({ rentPayments = [], isLoadingPayments }: PaymentsProps): React.JSX.Element {
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
