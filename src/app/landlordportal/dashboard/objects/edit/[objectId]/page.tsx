"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import { Seo } from "src/components/seo";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { ObjectEditForm } from "../object-edit-form";
import { useAtom, useSetAtom } from "jotai";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";

export default function Page(): React.JSX.Element {
  const searchParams = useSearchParams();
  const objectId = searchParams.get("objectId");

  const setSelectedRentalObjectId = useSetAtom(selectedRentalObjectIdAtom);
  async function setRentalObjectId() {
    if (objectId) {
      setSelectedRentalObjectId(objectId.toString() ?? "");
    }
  }
  const [{ data: rentalObject, isLoading, isError }] = useAtom(rentalObjectAtom);

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
              <Typography variant="h4">Objekt ändern</Typography>
              {isLoading ? <></> : <ObjectEditForm rentalObject={rentalObject} />}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
