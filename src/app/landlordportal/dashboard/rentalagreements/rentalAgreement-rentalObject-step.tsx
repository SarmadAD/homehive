import type { Dispatch, FC } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, FormControl, InputLabel, MenuItem, Select, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { z as zod } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import { useAtomValue } from "jotai";

interface RentalAgreementRentalObjectStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newRentalAgreement: RentalAgreement | undefined;
  setNewRentalAgreement: Dispatch<RentalAgreement | undefined>;
}

const schema = zod.object({
  rentalObjectId: zod.string().min(1, { message: "Es wurde kein Objekt ausgewählt" }),
});

type Values = zod.infer<typeof schema>;

export const RentalAgreementRentalObjectStep: FC<RentalAgreementRentalObjectStepProps> = (props) => {
  const { onBack, onNext, newRentalAgreement, setNewRentalAgreement, ...other } = props;
  const { data: rentalObjects, isLoading: rentalObjectsLoading } = useAtomValue(rentalObjectsAtom);

  const { control, handleSubmit } = useForm<Values>({
    defaultValues: {
      rentalObjectId: newRentalAgreement?.rentalObjectId || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Values) => {
    if (newRentalAgreement) {
      setNewRentalAgreement({ ...newRentalAgreement, rentalObjectId: data.rentalObjectId });
      if (onNext) onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        {/* <div>
          <Typography variant="subtitle1">An dieser E-Mail wird eine Einladung an den Mieter gesendet</Typography>
        </div> */}
        <Controller
          name="rentalObjectId"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel id="rental-object-select-label">Mietobjekt</InputLabel>
              {rentalObjectsLoading ? (
                <Skeleton width={400} height={50} />
              ) : (
                <Select labelId="rental-object-select-label" label="Mietobjekt" {...field} value={field.value || ""} displayEmpty>
                  <MenuItem value="" disabled>
                    Bitte Mietobjekt auswählen
                  </MenuItem>
                  {rentalObjects && rentalObjects.length > 0 ? (
                    rentalObjects.map((obj) => (
                      <MenuItem key={obj.id} value={obj.id}>
                        {obj.name || `Objekt #${obj.id}`}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Keine Mietobjekte vorhanden</MenuItem>
                  )}
                </Select>
              )}
              {fieldState.error && (
                <Typography color="error" variant="caption">
                  {fieldState.error.message}
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
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
