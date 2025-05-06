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

export const pricingPlans = [
  {
    cta: "Standard",
    subscription: true,
    currency: "€",
    description: "Alles was wir haben",
    features: ["Vermieter-Portal", "Mieter-Portal", "Mieteinnahmen einsehen", "Objekte erstellen", "Mieter einladen"],
    icon: <PricingPlanIcon name="standard" />,
    name: "Standard",
    price: "2,59",
    link: process.env.NODE_ENV === "development" ? "https://buy.stripe.com/test_7sIfZafKM4ZQcs8000" : "",
    priceId: process.env.NODE_ENV === "development" ? "price_1RLqk2FJT2pyPaEfZLChFA2t" : "",
    sx: {
      height: "100%",
      maxWidth: 460,
      mx: "auto",
    },
  },
  {
    cta: "Einmalig",
    subscription: false,
    currency: "€",
    description: "Alles was wir haben ein Lebenlang",
    features: ["Vermieter-Portal", "Mieter-Portal", "Mieteinnahmen einsehen", "Objekte erstellen", "Mieter einladen"],
    icon: <PricingPlanIcon name="lifetime" />,
    name: "Einmalig",
    price: "39,99",
    link: process.env.NODE_ENV === "development" ? "https://buy.stripe.com/test_6oE28keGI9g64ZG9AB" : "",
    priceId: process.env.NODE_ENV === "development" ? "price_1RLqlBFJT2pyPaEfkiFIo14q" : "",
    popular: true,
    sx: {
      height: "100%",
      maxWidth: 460,
      mx: "auto",
    },
  },
];

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
      const authenticatedUserId = user?.id;
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
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
                Verwalte deine Immobilien mühelos mit unserer Lösung{" "}
              </Typography>
              <Typography color="text.secondary" sx={{ my: 2, textAlign: "center" }} variant="body1">
                Unsere benutzerfreundliche Software macht es einfach, deine Immobilien effizient zu verwalten. Behalte
                den Überblick über Mietzahlungen, Mieter, Objekte und mehr – alles auf einen Blick
              </Typography>
              {/* <Stack alignItems="center" direction="row" spacing={1}>
                <Switch checked />
                <Typography variant="body1">Jährliche Zahlung</Typography>
                <Chip color="primary" label="25% OFF" size="small" />
              </Stack> */}
            </Box>
            <Grid container spacing={6} justifyContent={"center"}>
              {pricingPlans.map((plan, index) => (
                <Grid key={index} xs={12} md={4}>
                  <PricingPlan {...plan} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
        {/* <Divider /> */}
        {/* <PricingFaqs /> */}
      </Box>
    </>
  );
}
