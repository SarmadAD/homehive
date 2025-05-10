import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Chip, InputAdornment, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { RentalObject } from "prisma/types/objects";
import { z as zod } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ObjectDetailsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newObject: RentalObject;
  setNewObject: Dispatch<RentalObject>;
}

const schema = zod.object({
  name: zod.string().min(1, { message: "Name des Objekts ist erforderlich" }),
  address: zod.string().min(1, { message: "Straße ist erforderlich" }),
  houseNr: zod.number().min(1, { message: "Hausnummer ist erforderlich" }),
  additionalHouseDetails: zod.string().optional(),
  city: zod.string().min(1, { message: "Ort ist erforderlich" }),
  postalCode: zod
    .number()
    .int()
    .refine((val) => val.toString().length === 5, { message: "PLZ muss aus 5 Ziffern bestehen" }),
});

type Values = zod.infer<typeof schema>;

export const ObjectBasicInfosStep: FC<ObjectDetailsStepProps> = (props) => {
  const { onBack, onNext, newObject, setNewObject, ...other } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      name: newObject.name || "",
      address: newObject.address || "",
      houseNr: newObject.houseNr || 0,
      additionalHouseDetails: newObject.additionalHouseDetails || "",
      city: newObject.city || "",
      postalCode: newObject.postalCode || 0,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Values) => {
    setNewObject({ ...newObject, ...data });
    if (onNext) onNext();
  };

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   const { value } = e.target;
  //   const parseValue = parseInt(value) ? parseInt(value) : value;
  //   setNewObject({
  //     ...newObject,
  //     [e.target.name]: parseValue,
  //   });
  // }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Name des Objekts"
              placeholder="Haus am See"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <div>
          <Typography variant="h6">Wo befindet sich das Objekt?</Typography>
        </div>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Straße" error={!!errors.address} helperText={errors.address?.message} />}
          />
          <Controller
            name="houseNr"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Hausnummer"
                type="number"
                error={!!errors.houseNr}
                helperText={errors.houseNr?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
          <Controller
            name="additionalHouseDetails"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Zusatz"
                type="text"
                error={!!errors.additionalHouseDetails}
                helperText={errors.additionalHouseDetails?.message}
                onChange={(e) => field.onChange(String(e.target.value))}
              />
            )}
          />
        </Stack>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Ort" error={!!errors.city} helperText={errors.city?.message} />}
          />
          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="PLZ"
                type="number"
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Stack>
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
            Weiter
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
