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
import { useAtom, useSetAtom } from "jotai";
import { updateRentalObjectAtom } from "src/state/atoms/updateRentalObjectAtom";
import { useSearchParams } from "next/navigation";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { ObjectBasicInfosStep } from "../../objects/object-basicinfos-step";
import { ObjectInfosStep } from "../../objects/object-objectInfos-step";
import { RentalAgreementRentalObjectStep } from "../rentalAgreement-rentalObject-step";
import { RentalAgreementRenterStep } from "../rentalAgreement-renter-step";
import { DueDateStep } from "../due-date-step";
import { RentInfoStep } from "../rent-info-step";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { updateRentalAgreementAtom } from "src/state/atoms/updateRentalAgreementAtom";

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

interface RentalAgreementEditFormProps {
  rentalAgreement: RentalAgreement | undefined;
}

export const RentalAgreementEditForm = ({ rentalAgreement }: RentalAgreementEditFormProps) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [currentRentalAgreement, setCurrentRentalAgreement] = useState<RentalAgreement | undefined>(rentalAgreement);

  const [{ mutateAsync: updateRentalAgreement }] = useAtom(updateRentalAgreementAtom);

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
      // {
      //   label: "Mietobjekt",
      //   content: (
      //     <RentalAgreementRentalObjectStep
      //       onBack={handleBack}
      //       onNext={handleNext}
      //       newRentalAgreement={currentRentalAgreement}
      //       setNewRentalAgreement={setCurrentRentalAgreement}
      //     />
      //   ),
      // },
      // {
      //   label: "Mieter",
      //   content: (
      //     <RentalAgreementRenterStep
      //       onBack={handleBack}
      //       onNext={handleNext}
      //       newRentalAgreement={currentRentalAgreement}
      //       setNewRentalAgreement={setCurrentRentalAgreement}
      //     />
      //   ),
      // },
      {
        label: "Fälligkeitstag",
        content: <DueDateStep onNext={handleNext} newRentalAgreement={currentRentalAgreement} setNewRentalAgreement={setCurrentRentalAgreement} />,
      },
      {
        label: "Mietinformationen",
        content: (
          <RentInfoStep
            onBack={handleBack}
            onNext={handleComplete}
            newRentalAgreement={currentRentalAgreement}
            setNewRentalAgreement={setCurrentRentalAgreement}
          />
        ),
      },
    ];
  }, [handleBack, handleNext, handleComplete, currentRentalAgreement]);

  useEffect(() => {
    (async () => {
      if (!isComplete || !currentRentalAgreement) return;

      try {
        const updated = await updateRentalAgreement(currentRentalAgreement);
        setIsComplete(false);

        router.push(`${paths.landlordportal.dashboard.rentalagreements.index}`);
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
