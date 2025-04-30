"use client";

import { Metadata } from "next/types";
import * as React from "react";
import { site } from "src/config";
import { Hero } from "src/sections/home/home-hero";
import { useEffect } from "react";

// export const metadata = { title: site.name, description: site.description } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <main>
      <Hero />
    </main>
  );
}
