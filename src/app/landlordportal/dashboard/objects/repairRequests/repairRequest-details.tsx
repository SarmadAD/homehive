import { ChangeEvent, ChangeEventHandler, FC, useState } from "react";
import PropTypes from "prop-types";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import { OutlinedInput, Theme } from "@mui/material";
import { Button, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { useRepairRequestStatusPill } from "src/hooks/use-status-pill";
import { RepairRequest } from "prisma/types/repairRequest";
import { getRenterName } from "src/utils/get-renter-name";

interface RepairRequestDetailsProps {
  onEdit?: () => void;
  onPaid?: () => void;
  repairRequest: RepairRequest;
  handleAcceptRepairRequest: () => void;
  handleRejectRepairRequest: () => void;
  handleDoneRepairRequest: () => void;
  handleCanceledRepairRequest: () => void;
}

export const RepairRequestDetails: FC<RepairRequestDetailsProps> = (props) => {
  const { onEdit, repairRequest, handleRejectRepairRequest, handleAcceptRepairRequest, handleDoneRepairRequest, handleCanceledRepairRequest } = props;
  const [localRepairRequest, setRepairRequest] = useState<RepairRequest>(repairRequest);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const align = lgUp ? "horizontal" : "vertical";

  function handleCommentChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setRepairRequest({
      ...localRepairRequest,
      comment: e.target.value,
    });
  }

  /**
 * 
  REQUESTED => Button: Annhemen(Status:In Progress) und Ablehnen(Status:Rejected)
  REJECTED => Kein Buttons
  DONE => Keine Buttons
  CANCELED => Keine Buttons
  INPROGRESS => Buttons: Fertig(Status:done) und Abbrechen (Canceld)
 */
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
          <PropertyListItem align={align} disableGutters divider label="Mieter">
            <Typography color="text.secondary" variant="body2">
              {getRenterName(repairRequest.renter.firstname, repairRequest.renter.surname)}
            </Typography>
          </PropertyListItem>

          <PropertyListItem align={"vertical"} divider label="Kommentar">
            <OutlinedInput fullWidth name="comment" required multiline rows={6} value={localRepairRequest.comment} onChange={handleCommentChange} />
          </PropertyListItem>

          <PropertyListItem align={align} disableGutters divider label="Status">
            {statusPill}
          </PropertyListItem>
        </PropertyList>

        {localRepairRequest.status === "REQUESTED" && (
          <Stack alignItems="center" direction="row" flexWrap="wrap" justifyContent="flex-end" spacing={2}>
            <Button onClick={handleAcceptRepairRequest} size="small" variant="contained" color="success">
              Annehmen
            </Button>
            <Button onClick={handleRejectRepairRequest} size="small" variant="contained" color="warning">
              Ablehnen
            </Button>
          </Stack>
        )}
        {localRepairRequest.status === "INPROGRESS" && (
          <Stack alignItems="center" direction="row" flexWrap="wrap" justifyContent="flex-end" spacing={2}>
            <Button onClick={handleDoneRepairRequest} size="small" variant="contained" color="success">
              Fertig
            </Button>
            <Button onClick={handleCanceledRepairRequest} size="small" variant="contained" color="error">
              Abbrechen
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

RepairRequestDetails.propTypes = {
  onEdit: PropTypes.func,
  // @ts-ignore
  repairRequest: PropTypes.object,
};
