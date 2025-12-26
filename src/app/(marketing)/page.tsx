"use client";

import { Metadata } from "next/types";
import * as React from "react";
import { site } from "src/config";
import { Hero } from "src/sections/home/home-hero";
import { useEffect } from "react";
import { Features } from "src/sections/home/features";
import { HomeFeatures } from "src/sections/home/home-features";
import { StartManaging } from "src/sections/home/start-managing";
import { Faqs } from "src/sections/home/home-faqs";

// export const metadata = { title: site.name, description: site.description } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <>
      <Hero />
      <Features />
      {/* <HomeFeatures /> */}
      <Faqs />
      <StartManaging />
    </>
  );
}
