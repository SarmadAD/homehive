import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { PricingPlan } from "src/sections/pricing/pricing-plan";
import { pricingPlans } from "src/lib/marketing/pricing";
import { useState } from "react";

function PricingPlans() {
  const [checked, setChecked] = useState(true);

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          // backgroundColor: (theme) => (theme.palette.mode === "dark" ? "neutral.800" : "neutral.50"),
          // pb: "20px",
          pt: "30px",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              mb: 1,
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              Verwalte deine Immobilien mühelos mit unserer Lösung{" "}
            </Typography>
            <Typography color="text.secondary" sx={{ my: 2, textAlign: "center" }} variant="body1">
              Unsere benutzerfreundliche Software macht es einfach, deine Immobilien effizient zu verwalten. Behalte den Überblick über Mietzahlungen,
              Mieter, Objekte und mehr – alles auf einen Blick
            </Typography>
          </Box>
          <Grid container spacing={6} justifyContent={"center"}>
            {pricingPlans
              .filter((plan) => plan.name === "Free")
              .map((plan, index) => (
                <Grid key={`einmalig-${index}`} xs={12} md={4}>
                  <PricingPlan {...plan} />
                </Grid>
              ))}
            {pricingPlans
              .filter((plan) => (checked ? plan.name === "Jährlich" : plan.name === "Monatlich"))
              .map((plan, index) => (
                <Grid key={index} xs={12} md={4}>
                  <PricingPlan {...plan} setChecked={setChecked} checked={checked} />
                </Grid>
              ))}
            {pricingPlans
              .filter((plan) => plan.name === "Einmalig")
              .map((plan, index) => (
                <Grid key={`einmalig-${index}`} xs={12} md={4}>
                  <PricingPlan {...plan} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>
      {/* <Divider /> */}
      {/* <PricingFaqs /> */}
    </Box>
  );
}

export default PricingPlans;
