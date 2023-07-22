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
import { useRentPaidStatusPill } from "src/hooks/use-status-pill";
import { RentPayment } from "@prisma/client";
import agent from "src/api/agent";

interface Props {
  renter: Renter;
}

export function RentPaymentList({ renter }: Props) {
  async function onPaid(payment: RentPayment) {
    try {
      if (payment && (payment.status === "NOTPAID" || payment.status === "INARREARS")) {
        const newPayment: RentPayment = { ...payment, status: "PAID" };
        await agent.rentPayments.update(newPayment);
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
                {renter.rentPayment.find(
                  (rentPayment) => rentPayment.status === "INARREARS" || rentPayment.status === "NOTPAID"
                ) && <TableCell align="right">Action</TableCell>}
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
                        <Typography variant="subtitle2">
                          {new Date(rentPayment.dueDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{rentPayment.paymentAmount}</Typography>
                      </TableCell>

                      <TableCell>{statusPill}</TableCell>

                      {rentPayment.status === "INARREARS" ||
                        (rentPayment.status === "NOTPAID" && (
                          <TableCell align="right">
                            <Button onClick={() => onPaid(rentPayment)} size="small" variant="contained">
                              Bezahlt
                            </Button>
                          </TableCell>
                        ))}
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
