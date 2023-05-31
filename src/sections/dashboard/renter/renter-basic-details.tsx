import { ChangeEvent, FC, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardActions, CardHeader, Stack, TextField, Theme, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { RentalObject } from "src/types/object";
import { Renter } from "src/types/renter";
import { useStatusPill } from "src/hooks/use-status-pill";

export const RenterBasicDetails: FC<Renter> = (props) => {
  const { email, name, status } = props;

  const statusPill = useStatusPill(status);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const align = lgUp ? "horizontal" : "vertical";

  return (
    <Card>
      <CardHeader title="Basisinformationen" />
      <PropertyList>
        <PropertyListItem divider label="Kontaktdaten" value={email} />
        <PropertyListItem divider label="Name" value={name} />
        <PropertyListItem divider align={align} label="Miet Status">
          {statusPill}
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};

RenterBasicDetails.propTypes = {
  email: PropTypes.string,
  name: PropTypes.string,
};
