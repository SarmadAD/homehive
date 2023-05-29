import type { FC } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import type { Theme } from "@mui/material";
import { Button, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { Renter } from "src/types/renter";

interface RenterDetailsProps {
  onEdit?: () => void;
  renter: Renter;
}

export const RenterDetails: FC<RenterDetailsProps> = (props) => {
  const { onEdit, renter } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const align = lgUp ? "horizontal" : "vertical";
  const createdAt = format(renter.createdAt, "dd/MM/yyyy HH:mm");

  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={3}>
          <Typography variant="h6">Details</Typography>
          <Button
            color="inherit"
            onClick={onEdit}
            size="small"
            startIcon={
              <SvgIcon>
                <Edit02Icon />
              </SvgIcon>
            }
          >
            Edit
          </Button>
        </Stack>
        <PropertyList>
          <PropertyListItem align={align} disableGutters divider label="Kontaktdaten">
            <Typography color="text.secondary" variant="body2">
              0123123123
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {renter.email}
            </Typography>
          </PropertyListItem>
        </PropertyList>
      </Stack>
    </Stack>
  );
};

RenterDetails.propTypes = {
  onEdit: PropTypes.func,
  // @ts-ignore
  renter: PropTypes.object,
};
