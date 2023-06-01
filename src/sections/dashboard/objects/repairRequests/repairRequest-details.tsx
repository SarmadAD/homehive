import { FC } from "react";
import PropTypes from "prop-types";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import { Theme } from "@mui/material";
import { Button, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useRepairRequestStatusPill } from "src/hooks/use-status-pill";
import { RepairRequest } from "src/types/repairRequest";

interface RepairRequestDetailsProps {
  onEdit?: () => void;
  onPaid?: () => void;
  repairRequest: RepairRequest;
}

export const RepairRequestDetails: FC<RepairRequestDetailsProps> = (props) => {
  const { onEdit, repairRequest, onPaid } = props;

  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const align = lgUp ? "horizontal" : "vertical";

  const statusPill = useRepairRequestStatusPill(repairRequest.status);
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
            {/* <Typography color="text.secondary" variant="body2">
              {repairRequest.email}
            </Typography> */}
          </PropertyListItem>{" "}
          <PropertyListItem align={align} disableGutters divider label="Status">
            {statusPill}
          </PropertyListItem>
        </PropertyList>
        <Stack alignItems="center" direction="row" flexWrap="wrap" justifyContent="flex-end" spacing={2}>
          <Button onClick={onPaid} size="small" variant="contained">
            Bezahlt
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

RepairRequestDetails.propTypes = {
  onEdit: PropTypes.func,
  // @ts-ignore
  repairRequest: PropTypes.object,
};
