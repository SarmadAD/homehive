import type { ChangeEvent, Dispatch, FC } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Button, Stack, SvgIcon, Typography } from "@mui/material";
import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { DueDateSelect } from "src/components/common/selects/dueDate";

interface DueDateStepProps {
  onNext?: () => void;
  onBack?: () => void;
  newRentalAgreement: RentalAgreement;
  setNewRentalAgreement: Dispatch<RentalAgreement>;
}

const schema = zod.object({
  dueDate: zod.string().min(1, { message: "Es wurde keine Fälligkeit ausgewählt" }),
});

type Values = zod.infer<typeof schema>;

export const DueDateStep: FC<DueDateStepProps> = (props) => {
  const { onBack, onNext, newRentalAgreement, setNewRentalAgreement, ...other } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      dueDate: newRentalAgreement.dueDateState || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Values) => {
    setNewRentalAgreement({ ...newRentalAgreement, dueDateState: data.dueDate as RentalAgreement["dueDateState"] });
    if (onNext) onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} {...other}>
        <DueDateSelect control={control} name="dueDate" />

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
