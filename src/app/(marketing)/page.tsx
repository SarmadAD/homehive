"use client";

import * as React from "react";
import { Hero } from "src/sections/home/home-hero";

// export const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <main>
      <Hero />
    </main>
  );
}
