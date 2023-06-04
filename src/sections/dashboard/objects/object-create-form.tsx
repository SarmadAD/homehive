import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import { JobDescriptionStep } from "../jobs/job-description-step";
import { JobPreview } from "../jobs/job-preview";
import { ObjectBasicInfosStep } from "./object-basicinfos-step";
import { RentalObject } from "src/types/object";
import { ObjectInfosStep } from "./object-objectInfos-step";
import { ObjectRentInfosStep } from "./object-rentInfos-step";

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

export const ObjectCreateForm: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [newObject, setNewObject] = useState<RentalObject>();

  const handleNext = useCallback(() => {
    setActiveStep((prevState) => prevState + 1);
    console.log(newObject);
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
        content: <ObjectBasicInfosStep onBack={handleBack} onNext={handleNext} newObject={newObject} setNewObject={setNewObject} />,
      },
      {
        label: "Objektinformationen",
        content: <ObjectInfosStep onBack={handleBack} onNext={handleNext} newObject={newObject} setNewObject={setNewObject} />,
      },
      {
        label: "Mietinformationen",
        content: <ObjectRentInfosStep onBack={handleBack} onNext={handleComplete} newObject={newObject} setNewObject={setNewObject} />,
      },
    ];
  }, [handleBack, handleNext, handleComplete, newObject]);

  if (isComplete) {
    return <JobPreview />;
  }

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
