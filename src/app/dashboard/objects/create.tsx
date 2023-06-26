import { Box, Breadcrumbs, Container, Grid, Link, Stack, Typography } from "@mui/material";
import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { ObjectCreateForm } from "src/app/dashboard/objects/objects/object-create-form";
import type { Page as PageType } from "src/types/page";

const Page: PageType = () => {
  usePageView();

  return (
    <>
      <Seo title="Objekt erstellen" />
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
              <Typography variant="h4">Erstelle ein Objekt</Typography>
              <ObjectCreateForm />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
