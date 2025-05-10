"use client";

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import { ObjectBasicInfosStep } from "./object-basicinfos-step";
import { ObjectInfosStep } from "./object-objectInfos-step";
import { ObjectRentInfosStep } from "./object-rentInfos-step";
import { RentalObject } from "prisma/types/objects";
import agent from "src/api/agent";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "src/hooks/use-router";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { paths } from "src/paths";

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

export const ObjectEditForm: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const rentalObject = useRecoilValue(rentalObjectAtom);
  const [currentObject, setCurrentObject] = useState<RentalObject>(rentalObject);
  const setRentalObject = useSetRecoilState(rentalObjectAtom);

  const router = useRouter();

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
        content: <ObjectInfosStep onBack={handleBack} onNext={handleNext} newObject={currentObject} setNewObject={setCurrentObject} />,
      },
      {
        label: "Mietinformationen",
        content: (
          <ObjectRentInfosStep
            operation="edit"
            onBack={handleBack}
            onNext={handleComplete}
            currentObject={currentObject}
            setCurrentObject={setCurrentObject}
            showDueDateAndRenter={false}
          />
        ),
      },
    ];
  }, [handleBack, handleNext, handleComplete, currentObject]);

  async function updateRentalObject(object: RentalObject) {
    try {
      if (object) {
        await agent.objects.update(object);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isComplete && currentObject) {
      const object: RentalObject = {
        ...currentObject,
      };
      setCurrentObject({
        ...currentObject,
      });
      setRentalObject({ ...currentObject });

      updateRentalObject(object);
      setIsComplete(false);
      router.push(`${paths.landlordportal.dashboard.objects.details}${encodeURIComponent(object.id)}`);
    }
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
            <StepLabel StepIconComponent={StepIcon}>
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
