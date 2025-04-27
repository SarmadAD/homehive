import { Chip } from "@mui/material";
import { RentPaymentStatus, RepairRequestStatus } from "@prisma/client";
import { RentalObject, RentalObjectStatus } from "prisma/types/objects";

export type ChipColor = "primary" | "secondary" | "error" | "info" | "warning" | "success";

export function getRentPaidStatusPill(rentPaidStatus: RentPaymentStatus): JSX.Element {
  const map: Record<RentPaymentStatus, { color: ChipColor; text: string }> = {
    PAID: {
      color: "success",
      text: "Bezahlt",
    },
    NOTPAID: {
      color: "warning",
      text: "Nicht bezahlt",
    },
    INARREARS: {
      color: "error",
      text: "Im Rückstand",
    },
  };

  const { text, color } = map[rentPaidStatus];

  return <Chip color={color} label={text} size="small" variant="soft"></Chip>;
}

export const useRepairRequestStatusPill = (orderStatus: RepairRequestStatus): JSX.Element => {
  const map: Record<RepairRequestStatus, { color: ChipColor; text: string }> = {
    DONE: {
      color: "success",
      text: "Fertig",
    },
    CANCELED: {
      color: "warning",
      text: "Abgebrochen",
    },
    INPROGRESS: {
      color: "info",
      text: "In Bearbeitung",
    },
    REJECTED: {
      color: "error",
      text: "Abgelehnt",
    },
    REQUESTED: {
      color: "primary",
      text: "Angefragt",
    },
  };

  const { text, color } = map[orderStatus];

  return <Chip color={color} label={text} size="small" variant="soft"></Chip>;
};

export const useRentalObjectStatusPill = (rentalObject: RentalObject): JSX.Element => {
  const map: Record<RentalObjectStatus, { color: ChipColor; text: string }> = {
    INHABITED: {
      color: "success",
      text: "Bewohnt",
    },
    UNINHABITED: {
      color: "info",
      text: "Unbewohnt",
    },
  };
  let status: RentalObjectStatus = RentalObjectStatus.UNINHABITED;
  if (rentalObject.renter.length > 0) {
    status = RentalObjectStatus.INHABITED;
  }
  const { text, color } = map[status];

  return <Chip color={color} label={text} size="small" variant="soft"></Chip>;
};
