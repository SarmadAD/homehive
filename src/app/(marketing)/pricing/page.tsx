"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/seo";
import { PricingFaqs } from "src/sections/pricing/pricing-faqs";
import { PricingPlan } from "src/sections/pricing/pricing-plan";
import { PricingPlanIcon } from "src/sections/pricing/pricing-plan-icon";

export default function Page(): React.JSX.Element {
  return (
    <>
      <Seo title="Preis" />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "neutral.800" : "neutral.50"),
            pb: "120px",
            pt: "184px",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                mb: 4,
              }}
            >
              <Typography variant="h3">Verwalten Sie Ihre Immobilien mühelos mit unserer Lösung</Typography>
              <Typography color="text.secondary" sx={{ my: 2, textAlign: "center" }} variant="body1">
                Unsere benutzerfreundliche Plattform bietet eine maßgeschneiderte Möglichkeit, <br />
                Ihre Immobilien effektiv zu verwalten und zu optimieren.
              </Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Switch checked />
                <Typography variant="body1">Jährliche Zahlung</Typography>
                <Chip color="primary" label="25% OFF" size="small" />
              </Stack>
            </Box>
            <Grid container spacing={10} justifyContent={"center"}>
              <Grid xs={12} md={4}>
                <PricingPlan
                  cta="Starter"
                  currency="€"
                  description="Lerne unsere Software kennen"
                  features={[
                    "Vermieter-Portal",
                    "Mieter-Portal",
                    "Mieteinnahmen einsehen",
                    "Ein Objekte erstellen",
                    "Mieter einladen",
                  ]}
                  icon={<PricingPlanIcon name="startup" />}
                  name="Starter"
                  price="0"
                  sx={{
                    height: "100%",
                    maxWidth: 460,
                    mx: "auto",
                  }}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <PricingPlan
                  cta="Standard"
                  currency="€"
                  description="Alles was wir haben"
                  features={[
                    "Vermieter-Portal",
                    "Mieter-Portal",
                    "Mieteinnahmen einsehen",
                    "Objekte erstellen",
                    "Mieter einladen",
                  ]}
                  icon={<PricingPlanIcon name="standard" />}
                  name="Standard"
                  popular
                  price="2,99"
                  sx={{
                    height: "100%",
                    maxWidth: 460,
                    mx: "auto",
                  }}
                />
              </Grid>
              {/* <Grid xs={12} md={4}>
                <PricingPlan
                  cta="Contact Us"
                  currency="€"
                  description="To familiarize yourself with our tools."
                  features={[
                    "All previous",
                    "Unlimited contacts",
                    "Analytics platform",
                    "Public API access",
                    "Send and sign unlimited contracts",
                  ]}
                  icon={<PricingPlanIcon name="business" />}
                  name="Business"
                  price="29.99"
                  sx={{
                    height: "100%",
                    maxWidth: 460,
                    mx: "auto",
                  }}
                />
              </Grid> */}
            </Grid>
          </Container>
        </Box>
        {/* <Divider /> */}
        {/* <PricingFaqs /> */}
      </Box>
    </>
  );
}
