import type { FC } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardActions, CardHeader } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { RentalObject } from "src/types/object";

export const ObjectBasicDetails: FC<RentalObject> = (props) => {
  const { address, areaSize, city, houseNr, postalCode, additionalHouseDetails } = props;

  return (
    <Card>
      <CardHeader title="Basic Details" />
      <PropertyList>
        <PropertyListItem divider label="Straße" value={`${address} ${houseNr} ${additionalHouseDetails ? additionalHouseDetails : ""}`} />
        <PropertyListItem divider label="Ort" value={`${postalCode} ${city}`} />
        <PropertyListItem divider label="Fläche" value={areaSize.toString()} />
      </PropertyList>
    </Card>
  );
};

ObjectBasicDetails.propTypes = {
  address: PropTypes.string.isRequired,
  areaSize: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  houseNr: PropTypes.number.isRequired,
  postalCode: PropTypes.string.isRequired,
  additionalHouseDetails: PropTypes.string,
};
