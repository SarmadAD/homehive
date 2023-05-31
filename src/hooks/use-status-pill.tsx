import { SeverityPill, SeverityPillColor } from "src/components/severity-pill";
import { RenterPaidStatus } from "src/types/renter";

export const useStatusPill = (rentPaidStatus: RenterPaidStatus): JSX.Element => {
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
