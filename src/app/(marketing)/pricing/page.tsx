"use client";

import React from "react";
import PricingPlans from "src/components/common/pricing/pricing-plans";
import { Faqs } from "src/sections/home/home-faqs";
import Box from "@mui/material/Box";
import { StartManaging } from "src/sections/home/start-managing";

function Page() {
  return (
    <Box
      sx={{
        maxWidth: "var(--maxWidth-xl)",
        m: "0 auto",
        "--Content-paddingX": "24px",
        "--Content-paddingY": { xs: "100px", lg: "100px" },
        p: "var(--Content-paddingY) var(--Content-paddingX)",
        width: "100%",
      }}
    >
      <PricingPlans />
      <Faqs />
      <StartManaging />
    </Box>
  );
}

export default Page;
