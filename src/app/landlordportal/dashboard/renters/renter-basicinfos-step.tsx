import type { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Renter } from "prisma/types/renter";

interface ObjectDetailsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newRenter: Renter;
  setNewRenter: Dispatch<Renter>;
}

export const RenterBasicInfosStep: FC<ObjectDetailsStepProps> = (props) => {
  const { onBack, onNext, newRenter, setNewRenter, ...other } = props;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const parseValue = parseInt(value) ? parseInt(value) : value;
    setNewRenter({
      ...newRenter,
      [e.target.name]: parseValue,
    });
  }

  return (
    <Stack spacing={3} {...other}>
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        <TextField fullWidth label="Vorname" name="firstname" value={newRenter.firstname} onChange={handleChange} />
        <TextField fullWidth label="Nachname" name="surname" value={newRenter.surname} onChange={handleChange} />
      </Stack>
      <div>
        <Typography variant="h6">An dieser E-Mail wird eine Einladung an den Mieter gesendet</Typography>
      </div>
      <TextField fullWidth label="E-Mail" name="email" value={newRenter.email} onChange={handleChange} />
      <Stack alignItems="center" direction="row" spacing={2}>
        <Button
          endIcon={
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          }
          onClick={onNext}
          variant="contained"
        >
          Weiter
        </Button>
      </Stack>
    </Stack>
  );
};

RenterBasicInfosStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
