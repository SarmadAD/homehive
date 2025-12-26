"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { ObjectCreateForm } from "./object-create-form";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";

export default function Page(): React.JSX.Element {
  return (
    <>
      <Seo title="Objekt erstellen" />
      <RoleBasedGuard permission="/landlordportal/dashboard/objects/create">
        <Box
          component="main"
          sx={{
            display: "flex",
            flexGrow: 1,
          }}
        >
          <Grid container sx={{ flexGrow: 1 }}>
            <Grid
              size={{ xs: 12, sm: 4 }}
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
              size={{ xs: 12, sm: 8 }}
              sx={{
                p: {
                  xs: 4,
                  sm: 6,
                  md: 8,
                },
              }}
            >
              <Stack maxWidth="sm" spacing={3}>
                <Typography variant="h4">Erstelle ein Objekt</Typography>
                <ObjectCreateForm />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </RoleBasedGuard>
    </>
  );
}
