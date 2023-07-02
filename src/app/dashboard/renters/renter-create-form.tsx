"use client";

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import agent from "src/api/agent";
import { useRecoilValue } from "recoil";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { useRouter } from "src/hooks/use-router";
import { RenterBasicInfosStep } from "./renter-basicinfos-step";
import { Renter, renterDefault } from "prisma/types/renter";

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

export const RenterCreateForm: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [newRenter, setNewRenter] = useState<Renter>(renterDefault);
  const landlord = useRecoilValue(currentLandlordAtom);
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
        content: <RenterBasicInfosStep onBack={handleBack} onNext={handleNext} newRenter={newRenter} setNewRenter={setNewRenter} />,
      },
    ];
  }, [handleBack, handleNext, handleComplete, newRenter]);

  // async function createRentalObject() {
  //   try {
  //     if (newRenter) {
  //       await agent.objects.create(newRenter);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   if (isComplete && newRenter) {
  //     setNewRenter({ ...newRenter, landlord: landlord, createdAt: new Date() });
  //   }
  // }, [isComplete]);

  // useEffect(() => {
  //   if (isComplete && newRenter.landlord.id) {
  //     createRentalObject();
  //     setIsComplete(false);
  //     router.push("/dashboard/objects");
  //   }
  // }, [newRenter.landlord]);

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
