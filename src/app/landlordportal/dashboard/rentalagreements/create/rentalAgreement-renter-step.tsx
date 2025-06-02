import type { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, FormControl, InputLabel, Link, MenuItem, Select, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Renter } from "prisma/types/renter";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { useRecoilValue } from "recoil";
import { paths } from "src/paths";
import { RouterLink } from "src/components/router-link";

interface RentalAgreementRenterStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newRentalAgreement: RentalAgreement;
  setNewRentalAgreement: Dispatch<RentalAgreement>;
}

const schema = zod.object({
  renterId: zod.string().min(1, { message: "Es wurde kein Mieter ausgewählt" }),
});

type Values = zod.infer<typeof schema>;

export const RentalAgreementRenterStep: FC<RentalAgreementRenterStepProps> = (props) => {
  const { onBack, onNext, newRentalAgreement, setNewRentalAgreement, ...other } = props;
  const renters = useRecoilValue(rentersAtom).filter((renter) => !renter.rentalAgreementId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      renterId: newRentalAgreement.renter?.id || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Values) => {
    const selectedRenter = renters.find((renter) => renter.id === data.renterId) || null;
    setNewRentalAgreement({ ...newRentalAgreement, renter: selectedRenter });
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <Controller
          name="renterId"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel id="renter-select-label">Mieter</InputLabel>
              <Select labelId="renter-select-label" label="Mieter" {...field} value={field.value || ""} displayEmpty disabled={renters.length === 0}>
                {renters.length > 0 ? (
                  <MenuItem value="" disabled>
                    Bitte Mieter auswählen
                  </MenuItem>
                ) : (
                  <MenuItem value="" disabled>
                    Keine Mieter vorhanden
                  </MenuItem>
                )}
                {renters && renters.length > 0 ? (
                  renters.map((renter) => (
                    <MenuItem key={renter.id} value={renter.id}>
                      {renter.firstname} {renter.surname}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Keine Mieter vorhanden</MenuItem>
                )}
              </Select>
              {fieldState.error && (
                <Typography color="error" variant="caption">
                  {fieldState.error.message}
                </Typography>
              )}{" "}
              {renters.length === 0 && (
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Noch keinen Mieter angelegt?{" "}
                  <Link component={RouterLink} href={paths.landlordportal.dashboard.renters.index} underline="none">
                    Mieter erstellen
                  </Link>
                </Typography>
              )}
            </FormControl>
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
          </Button>{" "}
          <Button color="inherit" onClick={onBack}>
            Zurück
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
