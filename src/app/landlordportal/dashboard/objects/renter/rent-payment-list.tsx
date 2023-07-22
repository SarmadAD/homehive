import type { FC } from "react";
import { format, subDays, subHours, subMinutes, subSeconds } from "date-fns";
import numeral from "numeral";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import { Renter } from "prisma/types/renter";
import { useRentPaidStatusPill, useRepairRequestStatusPill } from "src/hooks/use-status-pill";

interface Props {
  renter: Renter;
}

export const RentPaymentList = ({ renter }: Props) => (
  <Box>
    <Card>
      <CardHeader title="Mietzahlungen" />
      <Divider />
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fälligkeit</TableCell>
              <TableCell>Mietzahlung</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renter.rentPayment
              .filter((payment) => payment.rentalObjectId === renter.rentalObjectId)
              .map((rentPayment) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const statusPill = useRentPaidStatusPill(rentPayment.status);
                return (
                  <TableRow hover key={rentPayment.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{new Date(rentPayment.dueDate).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{rentPayment.paymentAmount}</Typography>
                    </TableCell>

                    <TableCell>{statusPill}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  </Box>
);
