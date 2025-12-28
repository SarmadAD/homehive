"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RentalAgreementEditForm } from "../rentalagreement-edit-form";
import { useAtom, useSetAtom } from "jotai";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { selectedRentalAgreementIdAtom } from "src/state/atoms/selectedRentalAgreementIdAtom";
import { rentalAgreementAtom } from "src/state/atoms/rentalAgreementAtom";

export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams();
  const rentalAgreementId = searchParams.get("rentalAgreementId");

  const setSelectedRentalAgreementId = useSetAtom(selectedRentalAgreementIdAtom);
  async function setRentalAgreementId() {
    if (rentalAgreementId) {
      setSelectedRentalAgreementId(rentalAgreementId.toString() ?? "");
    }
  }
  const [{ isLoading: rentalAgreementLoading, data: rentalAgreement }] = useAtom(rentalAgreementAtom);

  useEffect(
    () => {
      setRentalAgreementId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <Seo title="Mietverhältnis ändern" />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexGrow: 1,
        }}
      >
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
            sx={{
              backgroundImage: "url(/assets/people-talking.png)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              display: {
                xs: "none",
                md: "block",
              },
            }}
          />
          <Grid
            size={{
              xs: 12,
              sm: 8,
            }}
            sx={{
              p: {
                xs: 4,
                sm: 6,
                md: 8,
              },
            }}
          >
            <Stack maxWidth="sm" spacing={3}>
              <Typography variant="h4">Mietverhältnis ändern</Typography>
              {rentalAgreementLoading ? <></> : <RentalAgreementEditForm rentalAgreement={rentalAgreement} />}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
