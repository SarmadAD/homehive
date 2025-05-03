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
import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import agent from "src/api/agent";
import { useUser } from "src/hooks/use-user";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";

export default function Page(): React.JSX.Element {
  const setLandlord = useSetRecoilState(currentUserAtom);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    getLandlord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getLandlord() {
    try {
      setIsLoading(true);
      const firebaseUserId = user?.id;
      if (firebaseUserId) {
        const landlord = await agent.landlord.details(firebaseUserId);
        setLandlord(landlord);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Seo title="Preis" />
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
                Verwalten Sie Ihre Immobilien mühelos mit unserer Lösung
              </Typography>
              <Typography color="text.secondary" sx={{ my: 2, textAlign: "center" }} variant="body1">
                Unsere benutzerfreundliche Plattform bietet eine maßgeschneiderte Möglichkeit, <br />
                Ihre Immobilien effektiv zu verwalten und zu optimieren.
              </Typography>
              {/* <Stack alignItems="center" direction="row" spacing={1}>
                <Switch checked />
                <Typography variant="body1">Jährliche Zahlung</Typography>
                <Chip color="primary" label="25% OFF" size="small" />
              </Stack> */}
            </Box>
            <Grid container spacing={6} justifyContent={"center"}>
              <Grid xs={12} md={4}>
                <PricingPlan
                  cta="Standard"
                  subscription={true}
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
                  // popular
                  price="1,59"
                  sx={{
                    height: "100%",
                    maxWidth: 460,
                    mx: "auto",
                  }}
                />{" "}
              </Grid>
              <Grid xs={12} md={4}>
                <PricingPlan
                  cta="Einmalig"
                  subscription={false}
                  currency="€"
                  description="Alles was wir haben ein Lebenlang"
                  features={[
                    "Vermieter-Portal",
                    "Mieter-Portal",
                    "Mieteinnahmen einsehen",
                    "Objekte erstellen",
                    "Mieter einladen",
                  ]}
                  icon={<PricingPlanIcon name="lifetime" />}
                  name="Einmalig"
                  price="39,99"
                  popular
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
