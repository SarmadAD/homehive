import { SeverityPill, SeverityPillColor } from "src/components/severity-pill";
import { RenterPaidStatus } from "src/types/renter";
import { RepairRequestStatus } from "src/types/repairRequest";

export const useRentPaidStatusPill = (rentPaidStatus: RenterPaidStatus): JSX.Element => {
  const map: Record<RenterPaidStatus, { color: SeverityPillColor; text: string }> = {
    paid: {
      color: "success",
      text: "Bezahlt",
    },
    notPaid: {
      color: "warning",
      text: "Nicht bezahlt",
    },
    inArrears: {
      color: "error",
      text: "Im Rückstand",
    },
  };

  const { text, color } = map[rentPaidStatus];

  return <SeverityPill color={color}>{text}</SeverityPill>;
};

export const useRepairRequestStatusPill = (orderStatus: RepairRequestStatus): JSX.Element => {
  const map: Record<RepairRequestStatus, { color: SeverityPillColor; text: string }> = {
    done: {
      color: "success",
      text: "Fertig",
    },
    canceled: {
      color: "warning",
      text: "Abgebrochen",
    },
    inProgress: {
      color: "info",
      text: "In Bearbeitung",
    },
    rejected: {
      color: "error",
      text: "Abgelehnt",
    },
    requested: {
      color: "primary",
      text: "Angefragt",
    },
  };

  const { text, color } = map[orderStatus];

  return <SeverityPill color={color}>{text}</SeverityPill>;
};
