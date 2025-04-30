"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CurrencyEur as CurrencyEurIcon } from "@phosphor-icons/react/dist/ssr/CurrencyEur";
import { ColumnDef, DataTable } from "src/components/data-table";
import { dayjs } from "src/lib/dayjs";
import { useState } from "react";
import { getRentPaidStatusPill } from "src/hooks/use-status-pill";
import { useRecoilValueLoadable } from "recoil";
import { renterAtom } from "src/state/atoms/renterAtom";
import { RentPayment } from "@prisma/client";

dayjs.locale("de");

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
        {dayjs(row.paymentDate).format("DD. MMMM YYYY")}
      </Typography>
    ),
    name: "Date",
    align: "left",
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="subtitle2">
        {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(row.paymentAmount)}
      </Typography>
    ),
    name: "Miete",
    width: "200px",
  },
  {
    formatter: (row): React.JSX.Element => {
      const rentPaymentStatus = getRentPaidStatusPill(row.status);
      return rentPaymentStatus;
    },
    name: "Status",
    width: "200px",
  },
] satisfies ColumnDef<RentPayment>[];

export interface PaymentsProps {
  rentPayments: RentPayment[];
  isLoadingPayments: boolean;
}

export function PaidRents({ rentPayments = [], isLoadingPayments }: PaymentsProps): React.JSX.Element {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const renterLoadable = useRecoilValueLoadable(renterAtom);

  return (
    <Card>
      <CardHeader
        // action={
        //   <Button color="secondary" startIcon={<PlusIcon />}>
        //     Create Payment
        //   </Button>
        // }
        avatar={
          <Avatar>
            <CurrencyEurIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Bezahlte Mieten"
      />
      <CardContent>
        <Stack spacing={3}>
          {/* <Card sx={{ borderRadius: 1 }} variant="outlined">
            <Stack
              direction="row"
              divider={<Divider flexItem orientation="vertical" />}
              spacing={3}
              sx={{ justifyContent: "space-between", p: 2 }}
            >
              <div>
                <Typography color="text.secondary" variant="overline">
                  Gesamt Mieten bezahlt
                </Typography>
                <Typography variant="h6">{new Intl.NumberFormat("en-US").format(totalOrders)}</Typography>
              </div>
              <div>
                <Typography color="text.secondary" variant="overline">
                  Orders value
                </Typography>
                <Typography variant="h6">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(ordersValue)}
                </Typography>
              </div>
              <div>
                <Typography color="text.secondary" variant="overline">
                  Refunds
                </Typography>
                <Typography variant="h6">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(refundsValue)}
                </Typography>
              </div>
            </Stack>
          </Card> */}
          <Card sx={{ borderRadius: 1 }} variant="outlined">
            <Box sx={{ overflowX: "auto" }}>
              <DataTable<RentPayment>
                columns={columns}
                rows={rentPayments}
                isLoading={
                  isLoadingPayments ||
                  renterLoadable.state === "loading" ||
                  (renterLoadable.state === "hasValue" && renterLoadable.contents.id === "")
                }
              />
            </Box>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
}
