"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import type { Page as PageType } from "src/types/page";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useSearchParams } from "next/navigation";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { ObjectEditForm } from "../../object-edit-form";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import agent from "src/api/agent";
import { useUser } from "src/hooks/use-user";

const Page: PageType = () => {
  usePageView();

  const rentalObject = useRecoilValue(rentalObjectAtom);
  const setSelectedRentalObjectId = useSetRecoilState(selectedRentalObjectIdAtom);
  const searchParams = useSearchParams();
  const objectId = searchParams.get("objectId");

  const setLandlord = useSetRecoilState(currentUserAtom);
  const { user, error } = useUser();

  async function setRentalObjectId() {
    if (objectId) {
      setSelectedRentalObjectId(objectId.toString() ?? "");
    }
  }

  useEffect(
    () => {
      getLandlord();
      setRentalObjectId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function getLandlord() {
    try {
      const authenticatedUserId = user?.id;
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
        setLandlord(landlord);
      }
    } catch (error) {
      console.error(error);
    }
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
