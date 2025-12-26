"use client";

import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import { useRouter } from "src/hooks/use-router";
import { RentalAgreementRenterStep } from "./rentalAgreement-renter-step";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { RentalAgreementRentalObjectStep } from "./rentalAgreement-rentalObject-step";
import { RentalAgreement, rentalAgreementDefault } from "prisma/types/rentalAgreement";
import { DueDateStep } from "./due-date-step";
import { RentInfoStep } from "./rent-info-step";
import { paths } from "src/paths";
import { toast } from "src/components/toaster";
import { useAtom, useAtomValue } from "jotai";
import { createRentalAgreementAtom } from "src/state/atoms/createRentalAgreementAtom";

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

export default function RentalAgreementCreateForm(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [newRentalAgreement, setNewRentalAgreement] = useState<RentalAgreement>(rentalAgreementDefault);

  const router = useRouter();

  const [{ mutateAsync: createRentalAgreement }] = useAtom(createRentalAgreementAtom);
  const { data: landlord } = useAtomValue(currentLandlordAtom);

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
        label: "Mietobjekt",
        content: (
          <RentalAgreementRentalObjectStep
            onBack={handleBack}
            onNext={handleNext}
            newRentalAgreement={newRentalAgreement}
            setNewRentalAgreement={setNewRentalAgreement}
          />
        ),
      },
      {
        label: "Mieter",
        content: (
          <RentalAgreementRenterStep
            onBack={handleBack}
            onNext={handleNext}
            newRentalAgreement={newRentalAgreement}
            setNewRentalAgreement={setNewRentalAgreement}
          />
        ),
      },
      {
        label: "Fälligkeitstag",
        content: (
          <DueDateStep
            onBack={handleBack}
            onNext={handleNext}
            newRentalAgreement={newRentalAgreement}
            setNewRentalAgreement={setNewRentalAgreement}
          />
        ),
      },
      {
        label: "Mietinformationen",
        content: (
          <RentInfoStep
            onBack={handleBack}
            onNext={handleComplete}
            newRentalAgreement={newRentalAgreement}
            setNewRentalAgreement={setNewRentalAgreement}
          />
        ),
      },
    ];
  }, [handleBack, handleNext, handleComplete, newRentalAgreement]);

  async function handleCreateRentalAgreement() {
    try {
      const landlordId = landlord?.id ?? "";
      if (newRentalAgreement && landlordId) {
        const created = await createRentalAgreement({
          agreement: newRentalAgreement,
          landlordId,
        });
        if (created?.id) {
          toast.success("Mietverhältnis erfolgreich erstellt");
          router.push(paths.landlordportal.dashboard.rentalagreements.index);
        } else {
          toast.error("Erstellung fehlgeschlagen");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erstellung fehlgeschlagen");
    } finally {
      setIsComplete(false);
    }
  }

  useEffect(() => {
    if (isComplete) {
      handleCreateRentalAgreement();
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
}
