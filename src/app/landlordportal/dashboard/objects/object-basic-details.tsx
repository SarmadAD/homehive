import type { FC } from "react";
import { Card, CardHeader, Skeleton, Theme, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { useRentalObjectStatusPill } from "src/hooks/use-status-pill";
import { useAtom } from "jotai";

export const ObjectBasicDetails: FC = () => {
  const [{ data: rentalObject, isLoading }] = useAtom(rentalObjectAtom);

  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const align = lgUp ? "horizontal" : "vertical";

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Basisinformationen" />
        <PropertyList>
          <PropertyListItem divider label="Straße" valueJSX={<Skeleton width="60%" />} />
          <PropertyListItem divider label="Ort" valueJSX={<Skeleton width="40%" />} />
          <PropertyListItem divider label="Fläche" valueJSX={<Skeleton width="30%" />} />
          <PropertyListItem divider align={align} label="Wohnstatus">
            <Skeleton width="50%" />
          </PropertyListItem>
        </PropertyList>
      </Card>
    );
  }

  // const { address, areaSize, city, houseNr, postalCode, additionalHouseDetails } = rentalObject;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const statusPill = useRentalObjectStatusPill(rentalObject);

  return (
    <Card>
      <CardHeader title="Basisinformationen" />
      <PropertyList>
        <PropertyListItem
          divider
          label="Straße"
          value={`${rentalObject?.address} ${rentalObject?.houseNr} ${rentalObject?.additionalHouseDetails ?? ""}`}
        />
        <PropertyListItem divider label="Ort" value={`${rentalObject?.postalCode} ${rentalObject?.city}`} />
        <PropertyListItem divider label="Fläche" value={rentalObject?.areaSize?.toString() + " " + "m²"} />
        <PropertyListItem divider align={align} label="Wohnstatus">
          {statusPill}
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};
