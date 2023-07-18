"use client";

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import { ObjectBasicInfosStep } from "./object-basicinfos-step";
import { ObjectInfosStep } from "./object-objectInfos-step";
import { ObjectRentInfosStep } from "./object-rentInfos-step";
import { v4 as uuidv4 } from "uuid";
import { RentalObject, rentalObjectDefault } from "prisma/types/objects";
import agent from "src/api/agent";
import { useRecoilValue } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { useRouter } from "src/hooks/use-router";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { DueDateOfRent } from "@prisma/client";
import { Renter } from "prisma/types/renter";

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
  const [newObject, setNewObject] = useState<RentalObject>(rentalObjectDefault);
  const landlord = useRecoilValue(currentUserAtom);
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
        content: (
          <ObjectBasicInfosStep
            onBack={handleBack}
            onNext={handleNext}
            newObject={newObject}
            setNewObject={setNewObject}
          />
        ),
      },
      {
        label: "Objektinformationen",
        content: (
          <ObjectInfosStep onBack={handleBack} onNext={handleNext} newObject={newObject} setNewObject={setNewObject} />
        ),
      },
      {
        label: "Mietinformationen",
        content: (
          <ObjectRentInfosStep
            onBack={handleBack}
            onNext={handleComplete}
            newObject={newObject}
            setNewObject={setNewObject}
            showDueDateAndRenter={true}
          />
        ),
      },
    ];
  }, [handleBack, handleNext, handleComplete, newObject]);

  async function createRentalObject() {
    try {
      if (newObject) {
        const response = await agent.objects.create(newObject);
        if ("error" in response) {
          throw new Error(String(response.error));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isComplete && newObject) {
      const rentalAgreements: RentalAgreement[] = newObject.renter.map((renter) => {
        const newRentalAgreement: RentalAgreement = {
          id: "",
          dueDate: new Date(),
          dueDateState: "FIRSTMONTH",
          renter: renter,
          rentalObjectId: newObject.id,
          rentalObject: newObject,
        };
        return newRentalAgreement;
      });

      setNewObject({
        ...newObject,
        landlord: landlord,
        createdAt: new Date(),
        status: newObject.renter.length > 0 ? "INHABITED" : "UNINHABITED",
        rentalAgreement: rentalAgreements,
      });
    }
  }, [isComplete]);

  useEffect(() => {
    if (isComplete && newObject.landlord.id) {
      createRentalObject();
      setIsComplete(false);
      router.push("/landlordportal/dashboard/objects");
    }
  }, [newObject.landlord]);

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
