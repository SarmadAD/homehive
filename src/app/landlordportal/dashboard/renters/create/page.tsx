"use client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import type { Page as PageType } from "src/types/page";
import { useEffect } from "react";
import agent from "src/api/agent";
import { useSetRecoilState } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { RenterCreateForm } from "../renter-create-form";
import { useUser } from "src/hooks/use-user";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";

const Page: PageType = () => {
  usePageView();

  const setLandlord = useSetRecoilState(currentUserAtom);
  const { user, error } = useUser();

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Seo title="Mieter erstellen" />
      <RoleBasedGuard permission="/landlordportal/dashboard/renters/create">
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
                <Typography variant="h4">Lade einen Mieter</Typography>
                <RenterCreateForm />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </RoleBasedGuard>
    </>
  );
};

export default Page;
