"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ColumnDef, DataTable } from "src/components/data-table";
import { dayjs } from "src/lib/dayjs";
import { getRentPaidStatusPill } from "src/hooks/use-status-pill";
import { RentPayment } from "@prisma/client";
import { List, ListItem, Theme, useMediaQuery } from "@mui/material";
import { MobileCardSkeleton } from "src/skeleton/dashboard-skeletons";

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
  isLoading: boolean;
}

function MobileRentPaymentCard({ rentPayment }: { rentPayment: RentPayment }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 2, background: "#fff" }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {dayjs(rentPayment.paymentDate).format("DD. MMMM YYYY")}
        </Typography>
        <List sx={{ "& .MuiListItem-root": { px: 0, py: 1 } }}>
          <ListItem divider>
            <Typography variant="subtitle2">Miete</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ ml: "auto" }}>
              {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(rentPayment.paymentAmount)}
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="subtitle2">Status</Typography>
            <Box sx={{ ml: "auto" }}>{getRentPaidStatusPill(rentPayment.status)}</Box>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export function PaidRents({ rentPayments = [], isLoading }: PaymentsProps): React.JSX.Element {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        {isLoading ? (
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
          (rentPayments ?? []).map((rentPayment) => <MobileRentPaymentCard key={rentPayment.id} rentPayment={rentPayment} />)
        )}
      </Box>
    );
  }
  return (
    <React.Fragment>
      <DataTable<RentPayment> columns={columns} rows={rentPayments} isLoading={isLoading} />{" "}
      {!rentPayments.length && !isLoading ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            Es wurden noch keine Mieten bezahlt
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
