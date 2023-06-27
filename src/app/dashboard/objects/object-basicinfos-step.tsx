import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Chip, InputAdornment, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { RentalObject } from "prisma/types/objects";

interface ObjectDetailsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newObject: RentalObject | undefined;
  setNewObject: Dispatch<RentalObject>;
}

export const ObjectBasicInfosStep: FC<ObjectDetailsStepProps> = (props) => {
  const { onBack, onNext, newObject, setNewObject, ...other } = props;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (newObject) {
      setNewObject({
        ...newObject,
        [e.target.name]: e.target.value,
      });
    }
  }

  return (
    <Stack spacing={3} {...other}>
      <TextField fullWidth label="Name des Objekts" name="name" placeholder="Haus am See" value={newObject?.name} onChange={handleChange} />
      <div>
        <Typography variant="h6">Wo befindet sich das Objekt?</Typography>
      </div>
      <Stack spacing={3} direction="row">
        <TextField fullWidth label="Straße" name="address" value={newObject?.address} onChange={handleChange} />
        <TextField fullWidth label="Hausnummer" name="houseNr" type="number" value={newObject?.houseNr} onChange={handleChange} />
        <TextField
          fullWidth
          label="Zusatz"
          name="additionalHouseDetails"
          type="addition"
          value={newObject?.additionalHouseDetails}
          onChange={handleChange}
        />
      </Stack>
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

ObjectBasicInfosStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
