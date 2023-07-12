import { FC } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, Theme, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
// import { useRentPaidStatusPill } from "src/hooks/use-status-pill";
import { Renter } from "@prisma/client";
import { getRenterName } from "src/utils/get-renter-name";

interface Props {
  renter: Renter;
}

export const RenterBasicDetails: FC<Props> = ({ renter: { email, firstname, surname } }: Props) => {
  // const statusPill = useRentPaidStatusPill(status);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const align = lgUp ? "horizontal" : "vertical";

  return (
    <Card>
      <CardHeader title="Basisinformationen" />
      <PropertyList>
        <PropertyListItem divider label="Kontaktdaten" value={email} />
        <PropertyListItem divider label="Name" value={getRenterName(firstname, surname)} />
        {/* <PropertyListItem divider align={align} label="Miet Status">
          {statusPill}
        </PropertyListItem> */}
      </PropertyList>
    </Card>
  );
};

RenterBasicDetails.propTypes = {
  // renter: PropTypes.object.isRequired,
};
