import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Chip, InputAdornment, MenuItem, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { RentalObject } from "src/types/object";

interface ObjectRentInfosStep {
  onNext?: () => void;
  onBack?: () => void;
  newObject: RentalObject | undefined;
  setNewObject: Dispatch<SetStateAction<RentalObject | undefined>>;
}

interface CategoryOption {
  label: string;
  value: string;
}

const categoryOptions: CategoryOption[] = [
  {
    label: "Healthcare",
    value: "healthcare",
  },
  {
    label: "Makeup",
    value: "makeup",
  },
  {
    label: "Dress",
    value: "dress",
  },
  {
    label: "Skincare",
    value: "skincare",
  },
  {
    label: "Jewelry",
    value: "jewelry",
  },
  {
    label: "Blouse",
    value: "blouse",
  },
];

const dueDateOfRent = [
  {
    label: "Zum 1 des Monats",
    value: "firstMonth",
  },
  {
    label: "Zum 15 des Monats",
    value: "middleMonth",
  },
  {
    label: "Zum 27 des Monats",
    value: "endMonth",
  },
];
export const ObjectRentInfosStep: FC<ObjectRentInfosStep> = (props) => {
  const { onBack, onNext, newObject, setNewObject, ...other } = props;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setNewObject({
      ...newObject?.rentInfo,
      [e.target.name]: e.target.value,
    });
    console.log(newObject);
  }

  return (
    <Stack spacing={3} {...other}>
      <Stack spacing={3} direction="row">
        <TextField fullWidth label="Kaltmiete" name="rentInfo.baseRent" value={newObject?.rentInfo?.baseRent} onChange={handleChange} type="number" />
        <TextField fullWidth label="Heizkosten" name="heatingCosts" value={newObject?.rentInfo?.heatingCosts} onChange={handleChange} type="number" />
      </Stack>

      <Stack spacing={3} direction="row">
        <TextField fullWidth label="Wasserkosten" name="waterCosts" value={newObject?.rentInfo?.waterCosts} onChange={handleChange} type="number" />
        <TextField
          fullWidth
          label="Stromkosten"
          name="electricityCosts"
          value={newObject?.rentInfo?.electricityCosts}
          onChange={handleChange}
          type="number"
        />
      </Stack>
      <Stack spacing={3} direction="column">
        <div>
          <Typography variant="h6">Füge ein Mieter zu dem neuen Objekt hinzu</Typography>
        </div>
        <TextField fullWidth label="Mieter" name="renter" onChange={handleChange} select>
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth label="Fälligkeit der Miete" name="dueDateOfRent" onChange={handleChange} select>
          {dueDateOfRent.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>{" "}
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
          Objekt Erstellen
        </Button>
        <Button color="inherit" onClick={onBack}>
          Zurück
        </Button>
      </Stack>
    </Stack>
  );
};

ObjectRentInfosStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
