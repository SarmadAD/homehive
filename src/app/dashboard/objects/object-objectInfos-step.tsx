import type { ChangeEvent, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Stack, SvgIcon, TextField } from "@mui/material";
import { RentalObject } from "src/types/object";
import { SetterOrUpdater } from "recoil";

interface ObjectInfosStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newObject: RentalObject | undefined;
  setNewObject: SetterOrUpdater<RentalObject>;
}

export const ObjectInfosStep: FC<ObjectInfosStepProps> = (props) => {
  const { onBack, onNext, newObject, setNewObject, ...other } = props;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setNewObject({
      ...newObject,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <Stack spacing={3} {...other}>
      <TextField fullWidth label="Fläche" name="areaSize" placeholder="101" value={newObject?.areaSize} onChange={handleChange} />
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
        <Button color="inherit" onClick={onBack}>
          Zurück
        </Button>
      </Stack>
    </Stack>
  );
};

ObjectInfosStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  newObject: PropTypes.object,
  setNewObject: PropTypes.func.isRequired,
};
