import { FC } from "react";
import { Avatar, Card, CardHeader, Skeleton } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useRecoilValueLoadable } from "recoil";
import { renterAtomWithRenterId } from "src/state/atoms/renterAtom";
import { Handshake as HandshakeIcon } from "@phosphor-icons/react/dist/ssr/Handshake";

export const RenterRentalAgreementInfos: FC = () => {
  const renterLoadable = useRecoilValueLoadable(renterAtomWithRenterId);

  if (renterLoadable.state === "loading" || (renterLoadable.state === "hasValue" && renterLoadable.contents.id === "")) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardHeader
          title="Mietverhältnis"
          avatar={
            <Avatar>
              <HandshakeIcon fontSize="var(--Icon-fontSize)" />
            </Avatar>
          }
        />
        <PropertyList>
          <PropertyListItem divider label="Grundmiete" valueJSX={<Skeleton width="40%" />} />
          <PropertyListItem divider label="Nebenkosten" valueJSX={<Skeleton width="40%" />} />
          <PropertyListItem divider label="Fälligkeit" valueJSX={<Skeleton width="40%" />} />
        </PropertyList>
      </Card>
    );
  }

  if (renterLoadable.state === "hasError") {
    return (
      <Card sx={{ mt: 2 }}>
        <CardHeader title="Mietverhältnis" />
        <PropertyList>
          <PropertyListItem divider label="Fehler" value="Fehler beim Laden des Mietverhältnis." />
        </PropertyList>
      </Card>
    );
  }

  const renter = renterLoadable.contents;
  const rentalAgreement = renter.rentalAgreement;

  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader
        title="Mietverhältnis"
        avatar={
          <Avatar>
            <HandshakeIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
      />
      <PropertyList>
        {rentalAgreement ? (
          <>
            <PropertyListItem
              divider
              label="Grundmiete"
              value={
                rentalAgreement.baseRent !== null && rentalAgreement.baseRent !== undefined ? `${rentalAgreement.baseRent} €` : "Nicht angegeben"
              }
            />
            <PropertyListItem
              divider
              label="Nebenkosten"
              value={
                rentalAgreement.serviceCharges !== null && rentalAgreement.serviceCharges !== undefined
                  ? `${rentalAgreement.serviceCharges} €`
                  : "Nicht angegeben"
              }
            />
            <PropertyListItem
              divider
              label="Fälligkeit"
              value={
                rentalAgreement.dueDateState === "FIRSTMONTH"
                  ? "Zum 1. des Monats"
                  : rentalAgreement.dueDateState === "MIDDLEMONTH"
                    ? "Zum 15. des Monats"
                    : rentalAgreement.dueDateState === "ENDMONTH"
                      ? "Zum 27. des Monats"
                      : "Nicht angegeben"
              }
            />
          </>
        ) : (
          <PropertyListItem divider label="Mietverhältnis" value="Kein Mietverhältnis vorhanden." />
        )}
      </PropertyList>
    </Card>
  );
};
