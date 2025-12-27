"use client";

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import { RentalObject } from "prisma/types/objects";
import { useRouter } from "src/hooks/use-router";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { paths } from "src/paths";
import { ObjectBasicInfosStep } from "../object-basicinfos-step";
import { ObjectInfosStep } from "../object-objectInfos-step";
import { useAtom, useSetAtom } from "jotai";
import { updateRentalObjectAtom } from "src/state/atoms/updateRentalObjectAtom";
import { useSearchParams } from "next/navigation";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";

const StepIcon: FC<StepIconProps> = (props) => {
  const { active, completed, icon } = props;

  const highlight = active || completed;

  return (
    <Avatar
      sx={{
        height: 40,
        width: 40,
        ...(highlight && {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }),
      }}
      variant="rounded"
    >
      {completed ? (
        <SvgIcon>
          <CheckIcon />
        </SvgIcon>
      ) : (
        icon
      )}
    </Avatar>
  );
};

interface ObjectEditFormProps {
  rentalObject: RentalObject | undefined;
}

export const ObjectEditForm = ({ rentalObject }: ObjectEditFormProps) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [currentObject, setCurrentObject] = useState<RentalObject | undefined>(rentalObject);

  const [{ mutateAsync: updateRentalObject }] = useAtom(updateRentalObjectAtom);

  const handleNext = useCallback(() => {
    setActiveStep((prevState) => prevState + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevState) => prevState - 1);
  }, []);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const steps = useMemo(() => {
    return [
      {
        label: "Basisinformationen",
        content: <ObjectBasicInfosStep onBack={handleBack} onNext={handleNext} newObject={currentObject} setNewObject={setCurrentObject} />,
      },
      {
        label: "Objektinformationen",
        content: <ObjectInfosStep onBack={handleBack} onNext={handleComplete} newObject={currentObject} setNewObject={setCurrentObject} />,
      },
    ];
  }, [handleBack, handleNext, handleComplete, currentObject]);

  useEffect(() => {
    (async () => {
      if (!isComplete || !currentObject) return;

      try {
        const updated = await updateRentalObject(currentObject);
        setIsComplete(false);

        router.push(`${paths.landlordportal.dashboard.objects.details}${encodeURIComponent(updated.id)}`);
      } catch (error) {
        console.error(error);
        setIsComplete(false);
      }
    })();
  }, [isComplete]);

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      sx={{
        "& .MuiStepConnector-line": {
          borderLeftColor: "divider",
          borderLeftWidth: 2,
          ml: 1,
        },
      }}
    >
      {steps.map((step, index) => {
        const isCurrentStep = activeStep === index;

        return (
          <Step key={step.label}>
            <StepLabel slots={{ stepIcon: StepIcon }}>
              <Typography sx={{ ml: 2 }} variant="overline">
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent
              sx={{
                borderLeftColor: "divider",
                borderLeftWidth: 2,
                ml: "20px",
                ...(isCurrentStep && {
                  py: 4,
                }),
              }}
            >
              {step.content}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};
