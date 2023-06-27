import { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, MenuItem, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { RentalObject } from "prisma/types/objects";

interface ObjectRentInfosStep {
  onNext?: () => void;
  onBack?: () => void;
  newObject: RentalObject | undefined;
  setNewObject: Dispatch<RentalObject>;
}

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

  const renters = useRecoilValue(rentersAtom);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (newObject === undefined) return;

    setNewObject({
      ...newObject,
      rentalObjectInfo: {
        ...newObject?.rentalObjectInfo,
        [e.target.name]: e.target.value,
      },
    });
    console.log(newObject);
  }

  function handleRenterChange(e: ChangeEvent<HTMLInputElement>) {
    if (newObject === undefined) return;
    const updatedRenter = Array.isArray(newObject.renter) ? [...newObject.renter, { name: e.target.value }] : [{ name: e.target.value }];
    setNewObject({ ...newObject, renter: [...newObject.renter, updatedRenter] });

    console.log(newObject);
  }

  return (
    <Stack spacing={3} {...other}>
      <Stack spacing={3} direction="row">
        <TextField fullWidth label="Kaltmiete" name="baseRent" value={newObject?.rentalObjectInfo?.baseRent} onChange={handleChange} type="number" />
        <TextField
          fullWidth
          label="Heizkosten"
          name="heatingCosts"
          value={newObject?.rentalObjectInfo?.heatingCosts}
          onChange={handleChange}
          type="number"
        />
      </Stack>

      <Stack spacing={3} direction="row">
        <TextField
          fullWidth
          label="Wasserkosten"
          name="waterCosts"
          value={newObject?.rentalObjectInfo?.waterCosts}
          onChange={handleChange}
          type="number"
        />
        <TextField
          fullWidth
          label="Stromkosten"
          name="electricityCosts"
          value={newObject?.rentalObjectInfo?.electricityCosts}
          onChange={handleChange}
          type="number"
        />
      </Stack>
      <Stack spacing={3} direction="column">
        <div>
          <Typography variant="h6">Füge ein Mieter zu dem neuen Objekt hinzu</Typography>
        </div>
        <TextField
          fullWidth
          label="Mieter"
          name="renter"
          onChange={handleRenterChange}
          select
          value={newObject?.renter ? newObject.renter[0].name : ""}
        >
          {renters?.map((renter) => (
            <MenuItem key={renter.id} value={renter.name}>
              {renter.name}
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
