import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Scrollbar } from "src/components/scrollbar";
import { Renter } from "prisma/types/renter";
import { getRentPaidStatusPill } from "src/hooks/use-status-pill";
import { RentPayment, RentPaymentStatus } from "@prisma/client";
import agent from "src/api/agent";
import { InputLabel, Select } from "@mui/material";
import { Option } from "src/components/option";
import { useState } from "react";

interface Props {
  renter: Renter;
}

export function RentPaymentList({ renter }: Props) {
  const [payments, setPayments] = useState(renter.rentPayment);

  async function handleStatusChange(rentPaymentId: string, updatedStatus: RentPaymentStatus) {
    try {
      const updatedPayment = payments.find((payment) => payment.id === rentPaymentId);
      if (updatedPayment) {
        const newPayment = { ...updatedPayment, status: updatedStatus, paymentDate: new Date() };
        await agent.rentPayments.update(newPayment);

        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === rentPaymentId ? { ...payment, status: updatedStatus } : payment
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
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
                {/* {renter.rentPayment.find(
                  (rentPayment) => rentPayment.status === "INARREARS" || rentPayment.status === "NOTPAID"
                ) && <TableCell align="right">Action</TableCell>} */}
              </TableRow>
            </TableHead>
            <TableBody>
              {payments
                .filter((payment) => payment.rentalObjectId === renter.rentalObjectId)
                .map((rentPayment) => {
                  // const statusPill = getRentPaidStatusPill(rentPayment.status);
                  return (
                    <TableRow hover key={rentPayment.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {new Date(rentPayment.dueDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{rentPayment.paymentAmount}</Typography>
                      </TableCell>

                      {/* <TableCell>{getRentPaidStatusPill(rentPayment.status)}</TableCell> */}

                      <TableCell>
                        <Select
                          variant="standard"
                          value={rentPayment.status}
                          onChange={(event) =>
                            handleStatusChange(rentPayment.id, event.target.value as RentPaymentStatus)
                          }
                        >
                          <Option value="NOTPAID">{getRentPaidStatusPill("NOTPAID")}</Option>
                          {/* <Option value="INARREARS">{getRentPaidStatusPill("INARREARS")}</Option> */}
                          <Option value="PAID">{getRentPaidStatusPill("PAID")}</Option>
                          {/* <Option value="CANCELED">{getRentPaidStatusPill("CANCELED")}</Option> */}
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>
    </Box>
  );
}
