import { RentPaymentStatus, RentalObjectStatus, RepairRequestStatus } from "@prisma/client";
import { RentalObject } from "prisma/types/objects";
import { SeverityPill, SeverityPillColor } from "src/components/severity-pill";

export function getRentPaidStatusPill(rentPaidStatus: RentPaymentStatus): JSX.Element {
  const map: Record<RentPaymentStatus, { color: SeverityPillColor; text: string }> = {
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

  return <SeverityPill color={color}>{text}</SeverityPill>;
}

export const useRepairRequestStatusPill = (orderStatus: RepairRequestStatus): JSX.Element => {
  const map: Record<RepairRequestStatus, { color: SeverityPillColor; text: string }> = {
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

  return <SeverityPill color={color}>{text}</SeverityPill>;
};

export const useRentalObjectStatusPill = (rentalObject: RentalObject): JSX.Element => {
  const map: Record<RentalObjectStatus, { color: SeverityPillColor; text: string }> = {
    INHABITED: {
      color: "success",
      text: "Bewohnt",
    },
    UNINHABITED: {
      color: "info",
      text: "Unbewohnt",
    },
  };
  let status: RentalObjectStatus = "UNINHABITED";
  if (rentalObject.status === "INHABITED") {
    status = "INHABITED";
  }
  const { text, color } = map[status];

  return <SeverityPill color={color}>{text}</SeverityPill>;
};
