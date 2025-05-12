import { ChangeEvent, Dispatch, FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Autocomplete, Button, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { RentalObject } from "prisma/types/objects";
import { getRenterName } from "src/utils/get-renter-name";
import { Renter } from "prisma/types/renter";
import { z as zod } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ObjectRentInfosStep {
  onNext?: () => void;
  onBack?: () => void;
  currentObject: RentalObject;
  setCurrentObject: Dispatch<RentalObject>;
  showDueDateAndRenter: boolean;
  operation: "create" | "edit";
}

const schema = zod.object({
  baseRent: zod.number().min(1, { message: "Die Kaltmiete muss größer als 0 sein" }),
  serviceCharges: zod.number().min(0, { message: "Nebenkosten dürfen nicht negativ sein" }).optional(),
});

type Values = zod.infer<typeof schema>;

export const ObjectRentInfosStep: FC<ObjectRentInfosStep> = (props) => {
  const { onBack, onNext, currentObject, setCurrentObject, showDueDateAndRenter, operation, ...other } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      baseRent: currentObject?.rentalObjectInfo?.baseRent || 0,
      serviceCharges: currentObject?.rentalObjectInfo?.serviceCharges || 0,
    },
    resolver: zodResolver(schema),
  });

  const renters = useRecoilValue(rentersAtom);

  const onSubmit = (data: Values) => {
    setCurrentObject({
      ...currentObject,
      rentalObjectInfo: {
        ...currentObject.rentalObjectInfo,
        baseRent: data.baseRent,
        serviceCharges: data.serviceCharges ?? 0,
      },
    });
    if (onNext) onNext();
  };

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   const { value } = e.target;
  //   const parseValue = parseInt(value) ? parseInt(value) : value;
  //   setCurrentObject({
  //     ...currentObject,
  //     rentalObjectInfo: {
  //       ...currentObject?.rentalObjectInfo,
  //       [e.target.name]: parseValue,
  //     },
  //   });
  // }

  // function handleRenterChange(event: React.SyntheticEvent, renter: Renter[] | null) {
  //   if (renter) {
  //     setCurrentObject({ ...currentObject, renter: renter });
  //   }
  // }

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
    // <Stack spacing={3} {...other}>
    //   <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
    //     <TextField
    //       fullWidth
    //       label="Kaltmiete"
    //       name="baseRent"
    //       value={currentObject?.rentalObjectInfo?.baseRent}
    //       onChange={handleChange}
    //       type="number"
    //     />
    //     <TextField
    //       fullWidth
    //       label="Nebenkosten"
    //       name="serviceCharges"
    //       value={currentObject.rentalObjectInfo.serviceCharges}
    //       onChange={handleChange}
    //       type="number"
    //     />
    //     {/* </Stack> */}
    //     {/* <TextField
    //       fullWidth
    //       label="Heizkosten"
    //       name="heatingCosts"
    //       value={currentObject.rentalObjectInfo.heatingCosts}
    //       onChange={handleChange}
    //       type="number"
    //     />
    //   </Stack>

    //   <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
    //     <TextField
    //       fullWidth
    //       label="Wasserkosten"
    //       name="waterCosts"
    //       value={currentObject.rentalObjectInfo.waterCosts}
    //       onChange={handleChange}
    //       type="number"
    //     />
    //     <TextField
    //       fullWidth
    //       label="Stromkosten"
    //       name="electricityCosts"
    //       value={currentObject.rentalObjectInfo.electricityCosts}
    //       onChange={handleChange}
    //       type="number"
    //     /> */}
    //   </Stack>

    //   {/* {operation === "create" && (
    //     <Stack spacing={3} direction="column">
    //       <div>
    //         <Typography variant="h6">Füge Mieter zu dem Objekt hinzu</Typography>
    //       </div>
    //       <Autocomplete
    //         multiple={true}
    //         onChange={handleRenterChange}
    //         getOptionLabel={(option: Renter) => getRenterName(option.firstname, option.surname)}
    //         options={renters}
    //         value={currentObject.renter as Renter[]}
    //         renderInput={(params): JSX.Element => <TextField {...params} fullWidth label="Mieter" name="renter" />}
    //       />
    //       <Typography color="text.secondary" variant="body2">
    //         Die Fälligkeit der Zahlung pro Mieter kann in der Objekteübersicht unter dem Tab Mieter geändert werden.
    //       </Typography>
    //     </Stack>
    //   )} */}

    //   <Stack alignItems="center" direction="row" spacing={2}>
    //     <Button
    //       endIcon={
    //         <SvgIcon>
    //           <ArrowRightIcon />
    //         </SvgIcon>
    //       }
    //       onClick={onNext}
    //       variant="contained"
    //     >
    //       Speichern
    //     </Button>
    //     <Button color="inherit" onClick={onBack}>
    //       Zurück
    //     </Button>
    //   </Stack>
    // </Stack>
  );
};

ObjectRentInfosStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};
