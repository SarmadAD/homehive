import type { FC } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, Skeleton, Theme, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useRecoilValueLoadable } from "recoil";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { useRentalObjectStatusPill } from "src/hooks/use-status-pill";

export const ObjectBasicDetails: FC = () => {
  const rentalObjectLoadable = useRecoilValueLoadable(rentalObjectAtom);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const align = lgUp ? "horizontal" : "vertical";

  if (
    rentalObjectLoadable.state === "loading" ||
    (rentalObjectLoadable.state === "hasValue" && rentalObjectLoadable.contents.id === "")
  ) {
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

  if (rentalObjectLoadable.state === "hasError") {
    return (
      <Card>
        <CardHeader title="Basisinformationen" />
        <PropertyList>
          <PropertyListItem divider label="Fehler" value="Fehler beim Laden der Daten." />
        </PropertyList>
      </Card>
    );
  }

  const rentalObject = rentalObjectLoadable.contents;
  const { address, areaSize, city, houseNr, postalCode, additionalHouseDetails } = rentalObject;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const statusPill = useRentalObjectStatusPill(rentalObject);

  return (
    <Card>
      <CardHeader title="Basisinformationen" />
      <PropertyList>
        <PropertyListItem
          divider
          label="Straße"
          value={`${address} ${houseNr} ${additionalHouseDetails ? additionalHouseDetails : ""}`}
        />
        <PropertyListItem divider label="Ort" value={`${postalCode} ${city}`} />
        <PropertyListItem divider label="Fläche" value={areaSize?.toString()} />
        <PropertyListItem divider align={align} label="Wohnstatus">
          {statusPill}
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};
