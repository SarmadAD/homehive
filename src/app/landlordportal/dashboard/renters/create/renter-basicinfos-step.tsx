import type { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Renter } from "prisma/types/renter";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ObjectDetailsStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newRenter: Renter;
  setNewRenter: Dispatch<Renter>;
}

const schema = zod.object({
  firstname: zod.string().min(1, { message: "Vorname ist erforderlich" }),
  surname: zod.string().min(1, { message: "Nachname ist erforderlich" }),
  email: zod.string().min(1, { message: "E-Mail ist erforderlich" }).email("Ungültige E-Mail"),
});

type Values = zod.infer<typeof schema>;

export const RenterBasicInfosStep: FC<ObjectDetailsStepProps> = (props) => {
  const { onBack, onNext, newRenter, setNewRenter, ...other } = props;

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   const { value } = e.target;
  //   const parseValue = parseInt(value) ? parseInt(value) : value;
  //   setNewRenter({
  //     ...newRenter,
  //     [e.target.name]: parseValue,
  //   });
  // }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      firstname: newRenter.firstname || "",
      surname: newRenter.surname || "",
      email: newRenter.email || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Values) => {
    setNewRenter({ ...newRenter, ...data });
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          <Controller
            name="firstname"
            control={control}
            render={({ field }) => (
              <TextField {...field} fullWidth label="Vorname" error={!!errors.firstname} helperText={errors.firstname?.message} />
            )}
          />
          <Controller
            name="surname"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth label="Nachname" error={!!errors.surname} helperText={errors.surname?.message} />}
          />
        </Stack>
        <div>
          <Typography variant="h6">An dieser E-Mail wird eine Einladung an den Mieter gesendet</Typography>
        </div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth label="E-Mail" type="email" error={!!errors.email} helperText={errors.email?.message} />
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
            Weiter
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

RenterBasicInfosStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
