"use client";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import type { Page as PageType } from "src/types/page";
import { ObjectCreateForm } from "../../object-create-form";
import { useEffect } from "react";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth/firebase";
import agent from "src/api/agent";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { useSearchParams } from "next/navigation";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { ObjectEditForm } from "../../object-edit-form";

const Page: PageType = () => {
  usePageView();

  const rentalObject = useRecoilValue(rentalObjectAtom);
  const setSelectedRentalObjectId = useSetRecoilState(selectedRentalObjectIdAtom);

  const searchParams = useSearchParams();
  const objectId = searchParams.get("objectId");

  async function setRentalObjectId() {
    if (objectId) {
      setSelectedRentalObjectId(objectId.toString() ?? "");
    }
  }

  useEffect(
    () => {
      setRentalObjectId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!rentalObject) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Seo title="Objekt ändern" />
      <Box
        component="main"
        sx={{
          display: "flex",
          flexGrow: 1,
        }}
      >
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid
            xs={12}
            sm={4}
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
            xs={12}
            md={8}
            sx={{
              p: {
                xs: 4,
                sm: 6,
                md: 8,
              },
            }}
          >
            <Stack maxWidth="sm" spacing={3}>
              <Typography variant="h4">Objekt ändern</Typography>
              <ObjectEditForm />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
