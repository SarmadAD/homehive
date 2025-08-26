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
        mt: { xs: 8, md: 10 },
      }}
    >
      <PricingPlans />
      <Faqs />
      <StartManaging />
    </Box>
  );
}

export default Page;
