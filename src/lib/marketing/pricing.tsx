import { PricingPlanIcon } from "src/sections/pricing/pricing-plan-icon";

export const pricingPlans = [
  {
    cta: "",
    currency: "€",
    subscriptionText: "",
    description: "Teste unsere Software",
    features: [
      { name: "Mieteinnahmen tracken", color: "success" },
      { name: "Vermieter-Portal", color: "success" },
      { name: "Mieter-Portal", color: "success" },
      { name: "1 Objekt erstellen", color: "grey" },
      { name: "1 Mieter einladen", color: "grey" },
      { name: "1 Mietverhältnis erstellen", color: "grey" },
    ],
    icon: <PricingPlanIcon name="startup" />,
    name: "Free",
    price: "0",
    sx: {
      height: "100%",
      maxWidth: 460,
      mx: "auto",
    },
  },
  {
    cta: "Jetzt monatlich starten",
    subscriptionText: "Monat",
    currency: "€",
    description: "Falls du mehr brauchst",
    features: [
      { name: "Mieteinnahmen tracken", color: "success" },
      { name: "Vermieter-Portal", color: "success" },
      { name: "Mieter-Portal", color: "success" },
      { name: "Objekte erstellen", color: "success" },
      { name: "Mieter einladen", color: "success" },
      { name: "Mietverhältnisse erstellen", color: "success" },
    ],
    icon: <PricingPlanIcon name="standard" />,
    name: "Monatlich",
    price: "4",
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_dRm14nfrddflcu8cqO5gc05"
        : "https://buy.stripe.com/eVq8wP3GH2sz2lyaSocjS00",
    priceId: process.env.NODE_ENV === "development" ? "price_1RP1rCFJT2pyPaEfwJyrU7UO" : "price_1RfN2tFAQVAyiPDH4wqYFh5W",
    hint: "Du kannst dein Abonnement jederzeit kündigen",
    sx: {
      height: "100%",
      maxWidth: 460,
      mx: "auto",
    },
  },
  {
    cta: "Jetzt jährlich starten",
    subscriptionText: "Monat",
    currency: "€",
    description: "Falls du mehr brauchst",
    features: [
      { name: "Mieteinnahmen tracken", color: "success" },
      { name: "Vermieter-Portal", color: "success" },
      { name: "Mieter-Portal", color: "success" },
      { name: "Objekte erstellen", color: "success" },
      { name: "Mieter einladen", color: "success" },
      { name: "Mietverhältnisse erstellen", color: "success" },
    ],
    icon: <PricingPlanIcon name="standard" />,
    name: "Jährlich",
    price: "2.80",
    // discountPrice: 36,
    discountPercentage: 30,
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_6oUdR9a6T3EL51GfD05gc04"
        : "https://buy.stripe.com/5kQ28r5OP3wD7FSe4AcjS01",
    priceId: process.env.NODE_ENV === "development" ? "price_1RP1rvFJT2pyPaEf5b4aaViA" : "price_1RfN2uFAQVAyiPDHrqxihofK",
    hint: "Du kannst dein Abonnement jederzeit kündigen.",
    sx: {
      height: "100%",
      maxWidth: 460,
      mx: "auto",
    },
  },
  {
    cta: "Für immer freischalten",
    subscriptionText: "",
    currency: "€",
    description: "Einmal zahlen, dauerhaft nutzen",
    features: [
      { name: "Mieteinnahmen tracken", color: "success" },
      { name: "Vermieter-Portal", color: "success" },
      { name: "Mieter-Portal", color: "success" },
      { name: "Objekte erstellen", color: "success" },
      { name: "Mieter einladen", color: "success" },
      { name: "Mietverhältnisse erstellen", color: "success" },
      { name: "Einmalige Zahlung", color: "success" },
    ],
    icon: <PricingPlanIcon name="lifetime" />,
    name: "Einmalig",
    price: "39",
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_14A6oHa6T1wD0LqgH45gc06"
        : "https://buy.stripe.com/28EfZh7WX9V1f8kf8EcjS03",
    priceId: process.env.NODE_ENV === "development" ? "price_1RfQhVFJT2pyPaEfzfAZ93Lr" : "price_1RfQjfFAQVAyiPDHRVfsohtj",
    popular: true,
    hint: "Einmal zahlen, dauerhaft nutzen",
    sx: {
      height: "100%",
      maxWidth: 460,
      mx: "auto",
    },
  },
];
