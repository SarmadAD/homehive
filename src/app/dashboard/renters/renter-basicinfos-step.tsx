import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Chip, InputAdornment, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { RentalObject } from "prisma/types/objects";
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
      <Stack spacing={3} direction="row">
        <TextField fullWidth label="Vorname" name="firstname" value={newRenter.firstname} onChange={handleChange} />
        <TextField fullWidth label="Nachname" name="surname" value={newRenter.surname} onChange={handleChange} />
      </Stack>
      <div>
        <Typography variant="h6">An dieser E-Mail wird eine Einladung an den Mieter gesendet</Typography>
      </div>
      <TextField fullWidth label="E-Mail" name="email" value={newRenter.email} onChange={handleChange} />
      {/* <Stack spacing={3} direction="row">
        <TextField fullWidth label="Straße" name="address" value={newObject.address} onChange={handleChange} />
        <TextField fullWidth label="Hausnummer" name="houseNr" type="number" value={newObject.houseNr} onChange={handleChange} />
        <TextField
          fullWidth
          label="Zusatz"
          name="additionalHouseDetails"
          type="addition"
          value={newObject.additionalHouseDetails}
          onChange={handleChange}
        />
      </Stack>
      <Stack spacing={3} direction={"row"}>
        <TextField fullWidth label="Ort" name="city" value={newObject.city} onChange={handleChange} />
        <TextField fullWidth label="PLZ" name="postalCode" value={newObject.postalCode} onChange={handleChange} />
      </Stack> */}
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
