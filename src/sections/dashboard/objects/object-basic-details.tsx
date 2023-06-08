import type { FC } from "react";
import PropTypes from "prop-types";
import { Card, CardHeader } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useRecoilValue } from "recoil";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";

export const ObjectBasicDetails: FC = () => {
  const rentalObject = useRecoilValue(rentalObjectAtom);
  const { address, areaSize, city, houseNr, postalCode, additionalHouseDetails } = rentalObject;

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
