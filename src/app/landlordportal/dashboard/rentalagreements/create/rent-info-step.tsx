import type { ChangeEvent, Dispatch, FC } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RentalAgreement } from "prisma/types/rentalAgreement";

interface RentInfoStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newRentalAgreement: RentalAgreement;
  setNewRentalAgreement: Dispatch<RentalAgreement>;
}

const schema = zod.object({
  baseRent: zod.string().min(1, { message: "Die Kaltmiete muss größer als 0 sein" }).regex(/^\d+$/, { message: "Nur Ziffern erlaubt" }),
  serviceCharges: zod.string().regex(/^\d*$/, { message: "Nur Ziffern erlaubt" }).optional(),
});

type Values = zod.infer<typeof schema>;

export const RentInfoStep: FC<RentInfoStepProps> = (props) => {
  const { onBack, onNext, newRentalAgreement, setNewRentalAgreement, ...other } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      baseRent: newRentalAgreement?.baseRent ? String(newRentalAgreement.baseRent) : "",
      serviceCharges: newRentalAgreement?.serviceCharges ? String(newRentalAgreement.serviceCharges) : "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Values) => {
    setNewRentalAgreement({ ...newRentalAgreement, baseRent: Number(data.baseRent), serviceCharges: Number(data.serviceCharges ?? 0) });
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          <Controller
            name="baseRent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Kaltmiete"
                type="text"
                error={!!errors.baseRent}
                helperText={errors.baseRent?.message}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
              />
            )}
          />
          <Controller
            name="serviceCharges"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nebenkosten"
                type="text"
                error={!!errors.serviceCharges}
                helperText={errors.serviceCharges?.message}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  field.onChange(value);
                }}
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
