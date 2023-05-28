import type { FC } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardActions, CardHeader } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { RentalObject } from "src/types/object";

export const ObjectBasicDetails: FC<RentalObject> = (props) => {
  const { address, areaSize, city, houseNr, postalCode, additionalHouseDetails, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Basic Details" />
      <PropertyList>
        <PropertyListItem divider label="Straße" value={`${address} ${houseNr} ${additionalHouseDetails ? additionalHouseDetails : ""}`} />
        <PropertyListItem divider label="Ort" value={`${postalCode} ${city}`} />
        <PropertyListItem divider label="Fläche" value={areaSize.toString()} />
      </PropertyList>
      <CardActions>
        <Button color="inherit" size="small">
          Reset Password
        </Button>
      </CardActions>
    </Card>
  );
};

ObjectBasicDetails.propTypes = {
  address: PropTypes.string,
  address2: PropTypes.string,
  country: PropTypes.string,
  email: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired,
  phone: PropTypes.string,
  state: PropTypes.string,
};
