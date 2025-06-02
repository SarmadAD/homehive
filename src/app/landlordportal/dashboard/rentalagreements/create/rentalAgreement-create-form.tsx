"use client";

import type { FC } from "react";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import type { StepIconProps } from "@mui/material";
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from "@mui/material";
import agent from "src/api/agent";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "src/hooks/use-router";
import { RentalAgreementRenterStep } from "./rentalAgreement-renter-step";
import { Renter, renterDefault } from "prisma/types/renter";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { RentalAgreementRentalObjectStep } from "./rentalAgreement-rentalObject-step";
import { RentalAgreement, rentalAgreementDefault } from "prisma/types/rentalAgreement";
import { DueDateStep } from "./due-date-step";
import { RentInfoStep } from "./rent-info-step";
import { paths } from "src/paths";
import { toast } from "src/components/toaster";
import { rentalAgreementsAtom } from "src/state/atoms/rentalAgreementsAtom";

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
  const setRentalAgreements = useSetRecoilState(rentalAgreementsAtom);

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

  async function createRentalAgreement() {
    try {
      if (newRentalAgreement) {
        const newRenterResponse = await agent.rentalAgreements.create(newRentalAgreement, landlord.id);
        if (newRenterResponse.id) {
          setRentalAgreements((prevRentalAgreements) => (prevRentalAgreements ? [...prevRentalAgreements, newRenterResponse] : [newRenterResponse]));

          toast.success("Mietverhältnis erfolgreich erstellt");
        }
        // setRenters((prevRenters) => (prevRenters ? [...prevRenters, newRenterResponse] : [newRenterResponse]));
        // setLandlords((prevLandlord) =>
        //   prevLandlord
        //     ? { ...prevLandlord, renters: prevLandlord.renters ? [...prevLandlord.renters, newRenterResponse] : [newRenterResponse] }
        //     : prevLandlord
        // );
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isComplete) {
      // setNewRenter({ ...newRenter, createdAt: new Date() });
      createRentalAgreement();
      setIsComplete(false);
      router.push(paths.landlordportal.dashboard.rentalagreements.index);
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
