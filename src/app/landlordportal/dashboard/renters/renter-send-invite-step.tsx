import type { Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Stack, SvgIcon, Typography } from "@mui/material";
import { Renter } from "prisma/types/renter";

interface ObjectDetailsStepProps {
  handleComplete?: () => void;
  onBack?: () => void;
  newRenter: Renter;
  setNewRenter: Dispatch<Renter>;
}

export const RenterSendInviteStep: FC<ObjectDetailsStepProps> = (props) => {
  const { onBack, handleComplete, newRenter, setNewRenter, ...other } = props;

  return (
    <Stack spacing={3} {...other}>
      <div>
        <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
          Nachdem Sie auf &quot;Einladung versenden&quot; klicken, wird eine E-Mail an dem Vermieter gesendet und somit
          der Mieter eingeladen zu seinem seperaten Mieterportal.
        </Typography>
      </div>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Button
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          onClick={handleComplete}
          variant="contained"
        >
          Einladung versenden
        </Button>
      </Stack>
    </Stack>
  );
};
