import type { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Renter } from "prisma/types/renter";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { useRecoilValue } from "recoil";
import { DueDateSelect } from "src/components/common/selects/dueDate";

interface RentInfoStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newRentalAgreement: RentalAgreement;
  setNewRentalAgreement: Dispatch<RentalAgreement>;
}

const schema = zod.object({
  baseRent: zod.number().min(1, { message: "Die Kaltmiete muss größer als 0 sein" }),
  serviceCharges: zod.number().min(0, { message: "Nebenkosten dürfen nicht negativ sein" }).optional(),
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
      baseRent: newRentalAgreement?.baseRent || 0,
      serviceCharges: newRentalAgreement?.serviceCharges || 0,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Values) => {
    setNewRentalAgreement({ ...newRentalAgreement, baseRent: data.baseRent, serviceCharges: data.serviceCharges ?? 0 });
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
                type="number"
                error={!!errors.baseRent}
                helperText={errors.baseRent?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
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
                type="number"
                error={!!errors.serviceCharges}
                helperText={errors.serviceCharges?.message}
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
