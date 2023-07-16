import { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Autocomplete, Button, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { RentalObject } from "prisma/types/objects";
// import { DueDateOfRent } from "@prisma/client";
import { getRenterName } from "src/utils/get-renter-name";
import { Renter } from "prisma/types/renter";

interface ObjectRentInfosStep {
  onNext?: () => void;
  onBack?: () => void;
  newObject: RentalObject;
  setNewObject: Dispatch<RentalObject>;
  showDueDateAndRenter: boolean;
}

type OptionRenter = {
  surname: string;
  firstname: string;
};

// type OptionDueDate = {
//   label: string;
//   value: DueDateOfRent;
// };

// const dueDateOfRentList: OptionDueDate[] = [
//   {
//     label: "Zum 1 des Monats",
//     value: DueDateOfRent.FIRSTMONTH,
//   },
//   {
//     label: "Zum 15 des Monats",
//     value: DueDateOfRent.MIDDLEMONTH,
//   },
//   {
//     label: "Zum 27 des Monats",
//     value: DueDateOfRent.ENDMONTH,
//   },
// ];

export const ObjectRentInfosStep: FC<ObjectRentInfosStep> = (props) => {
  const { onBack, onNext, newObject, setNewObject, showDueDateAndRenter, ...other } = props;

  const renters = useRecoilValue(rentersAtom);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const parseValue = parseInt(value) ? parseInt(value) : value;
    setNewObject({
      ...newObject,
      rentalObjectInfo: {
        ...newObject?.rentalObjectInfo,
        [e.target.name]: parseValue,
      },
    });
  }

  function handleRenterChange(event: React.SyntheticEvent, renter: Renter[] | null) {
    if (renter) {
      setNewObject({ ...newObject, renter: renter });
    }
  }

  // function handleDueDateChange(event: React.SyntheticEvent, dueDate: OptionDueDate | null) {
  //   if (dueDate) {
  //     setNewObject({
  //       ...newObject,
  //       rentalObjectInfo: {
  //         ...newObject?.rentalObjectInfo,
  //       },
  //     });
  //   }
  // }

  return (
    <Stack spacing={3} {...other}>
      <Stack spacing={3} direction="row">
        <TextField
          fullWidth
          label="Kaltmiete"
          name="baseRent"
          value={newObject?.rentalObjectInfo?.baseRent}
          onChange={handleChange}
          type="number"
        />
        <TextField
          fullWidth
          label="Heizkosten"
          name="heatingCosts"
          value={newObject.rentalObjectInfo.heatingCosts}
          onChange={handleChange}
          type="number"
        />
      </Stack>

      <Stack spacing={3} direction="row">
        <TextField
          fullWidth
          label="Wasserkosten"
          name="waterCosts"
          value={newObject.rentalObjectInfo.waterCosts}
          onChange={handleChange}
          type="number"
        />
        <TextField
          fullWidth
          label="Stromkosten"
          name="electricityCosts"
          value={newObject.rentalObjectInfo.electricityCosts}
          onChange={handleChange}
          type="number"
        />
      </Stack>
      {/* {showDueDateAndRenter && ( */}
      <Stack spacing={3} direction="column">
        <div>
          <Typography variant="h6">Füge Mieter zu dem Objekt hinzu</Typography>
        </div>
        <Autocomplete
          multiple={true}
          onChange={handleRenterChange}
          getOptionLabel={(option: OptionRenter) => getRenterName(option.firstname, option.surname)}
          options={renters}
          value={newObject.renter}
          renderInput={(params): JSX.Element => <TextField {...params} fullWidth label="Mieter" name="renter" />}
        />
        {/* <Autocomplete
            onChange={handleDueDateChange}
            getOptionLabel={(option: OptionDueDate) => option.label}
            options={dueDateOfRentList}
            value={dueDateOfRentList.find((x) => x.value === newObject.rentalObjectInfo.dueDateOfRent)}
            renderInput={(params): JSX.Element => (
              <TextField {...params} fullWidth label="Fälligkeit der Miete" name="dueDate" />
            )}
          /> */}
      </Stack>
      {/* )} */}

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
          Speichern
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
