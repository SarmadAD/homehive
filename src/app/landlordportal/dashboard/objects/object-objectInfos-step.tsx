import type { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, InputAdornment, Stack, SvgIcon, TextField } from "@mui/material";
import { RentalObject } from "prisma/types/objects";
import { z as zod } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ObjectInfosStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newObject: RentalObject;
  setNewObject: Dispatch<RentalObject>;
}

const schema = zod.object({
  areaSize: zod.string().min(1, { message: "Die Fläche muss angegeben werden" }).regex(/^\d+$/, { message: "Nur Ziffern erlaubt" }).optional(),
});

type Values = zod.infer<typeof schema>;

export const ObjectInfosStep: FC<ObjectInfosStepProps> = (props) => {
  const { onBack, onNext, newObject, setNewObject, ...other } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      areaSize: newObject.areaSize ? String(newObject.areaSize) : "",
    },
    resolver: zodResolver(schema),
  });

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   const { value } = e.target;
  //   const parseValue = parseInt(value) ? parseInt(value) : value;

  //   setNewObject({
  //     ...newObject,
  //     [e.target.name]: parseValue,
  //   });
  // }

  const onSubmit = (data: Values) => {
    setNewObject({ ...newObject, areaSize: Number(data.areaSize) });
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <Controller
          name="areaSize"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Fläche"
              name="areaSize"
              placeholder="42"
              type="text"
              InputProps={{
                endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                inputMode: "numeric",
              }}
              error={!!errors.areaSize}
              helperText={errors.areaSize?.message}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                field.onChange(value);
              }}
              sx={{ maxWidth: 150 }}
            />
          )}
        />
        <Stack alignItems="center" direction="row" spacing={2}>
          <Button
            endIcon={
              <SvgIcon>
                <ArrowRightIcon />
              </SvgIcon>
            }
            type="submit"
            variant="contained"
          >
            Speichern
          </Button>
          <Button color="inherit" onClick={onBack}>
            Zurück
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
