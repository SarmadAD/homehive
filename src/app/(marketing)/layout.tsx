"use client";

import * as React from "react";
import GlobalStyles from "@mui/material/GlobalStyles";
import { MainNav } from "src/components/marketing/layout/top-nav";
import { Footer } from "src/components/marketing/layout/footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          body: {
            "--MainNav-height": "72px",
            "--MainNav-zIndex": 1000,
            "--SideNav-width": "280px",
            "--SideNav-zIndex": 1100,
            "--MobileNav-width": "320px",
            "--MobileNav-zIndex": 1100,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
            backgroundImage: 'url("/assets/gradient-bg.svg")',
            pt: "120px",
          },
        }}
      />
      <div>
        <MainNav />
        {children}
        <Footer />
      </div>
    </React.Fragment>
  );
}
