import { PricingPlanIcon } from "src/sections/pricing/pricing-plan-icon";

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
