"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useSearchParams } from "next/navigation";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { ObjectEditForm } from "../../object-edit-form";

export default function Page(): React.JSX.Element {
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
}
