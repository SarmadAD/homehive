"use client";

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import { ObjectBasicInfosStep } from "./object-basicinfos-step";
import { ObjectInfosStep } from "./object-objectInfos-step";
import { ObjectRentInfosStep } from "./object-rentInfos-step";
import { RentalObject, rentalObjectDefault } from "prisma/types/objects";
import agent from "src/api/agent";
import { useRecoilValue } from "recoil";
import { useRouter } from "src/hooks/use-router";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { defaultLandlord } from "prisma/types/landlord";
import { paths } from "src/paths";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";

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
        content: <ObjectBasicInfosStep onBack={handleBack} onNext={handleNext} newObject={newObject} setNewObject={setNewObject} />,
      },
      {
        label: "Objektinformationen",
        content: <ObjectInfosStep onBack={handleBack} onNext={handleNext} newObject={newObject} setNewObject={setNewObject} />,
      },
      {
        label: "Mietinformationen",
        content: (
          <ObjectRentInfosStep
            operation="create"
            onBack={handleBack}
            onNext={handleComplete}
            currentObject={newObject}
            setCurrentObject={setNewObject}
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
        } else if (response.id) {
          return response;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function createRentalAgreement() {
    // DAs klappt sowiso noch nicht. Das wird garnicht gefüllt
    const rentalAgreements: RentalAgreement[] = newObject.renter.map((renter) => {
      const newRentalAgreement: RentalAgreement = {
        id: "",
        dueDateState: "FIRSTMONTH",
        renter: renter,
        rentalObjectId: newObject.id,
        rentalObject: newObject,
      };
      return newRentalAgreement;
    });
    return rentalAgreements;
  }

  useEffect(() => {
    if (isComplete && newObject) {
      const rentalAgreements = createRentalAgreement(); // DAs klappt sowiso noch nicht. Das wird garnicht gefüllt
      setNewObject({
        ...newObject,
        landlord: "hasAccess" in landlord ? landlord : defaultLandlord,
        createdAt: new Date(),
        rentalAgreement: rentalAgreements,
      });
    }
  }, [isComplete]);

  useEffect(() => {
    if (isComplete && newObject.landlord.id) {
      (async () => {
        const newRentalObject = await createRentalObject();
        setIsComplete(false);
        if (newRentalObject && newRentalObject.id) {
          router.push(`${paths.landlordportal.dashboard.objects.details}${encodeURIComponent(newRentalObject.id)}`);
        } else {
          router.push("/landlordportal/dashboard/objects");
        }
      })();
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
