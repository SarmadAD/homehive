"use client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import type { Page as PageType } from "src/types/page";
import { useEffect } from "react";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth/firebase";
import agent from "src/api/agent";
import { useSetRecoilState } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { RenterCreateForm } from "../renter-create-form";

const Page: PageType = () => {
  usePageView();

  const setLandlord = useSetRecoilState(currentUserAtom);
  const { user } = useAuth<AuthContextType>();

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLandlord() {
    try {
      const firebaseUserId = user?.id;
      if (firebaseUserId) {
        const landlord = await agent.landlord.details(firebaseUserId);
        setLandlord(landlord);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Seo title="Mieter erstellen" />
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
              <Typography variant="h4">Erstelle ein Mieter</Typography>
              <RenterCreateForm />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
