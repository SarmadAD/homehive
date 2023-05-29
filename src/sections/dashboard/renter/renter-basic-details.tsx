import type { FC } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardActions, CardHeader } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { RentalObject } from "src/types/object";
import { Renter } from "src/types/renter";

export const RenterBasicDetails: FC<Renter> = (props) => {
  const { email, name } = props;

  return (
    <Card>
      <CardHeader title="Basisinformationen" />
      <PropertyList>
        <PropertyListItem divider label="Kontaktdaten" value={email} />
        <PropertyListItem divider label="Name" value={name} />
      </PropertyList>
    </Card>
  );
};

RenterBasicDetails.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
};
