import { type FC, type ReactNode } from "react";
import { Box, GlobalStyles, useMediaQuery } from "@mui/material";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { layoutConfig } from "src/layouts/config";
import { useSettings } from "src/hooks/use-settings";

const SIDE_NAV_WIDTH: number = 280;

interface VerticalLayoutProps {
  children?: ReactNode;
}

export const VerticalLayout: FC<VerticalLayoutProps> = (props) => {
  const { children } = props;
  const settings = useSettings();

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            "--MainNav-height": "56px",
            "--MainNav-zIndex": 1000,
            "--SideNav-width": "280px",
            "--SideNav-zIndex": 1100,
            "--MobileNav-width": "320px",
            "--MobileNav-zIndex": 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: "var(--mui-palette-background-default)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          minHeight: "100%",
        }}
      >
        <SideNav color={settings.settings.navColor} items={layoutConfig.navItems} />
        <Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column", pl: { lg: "var(--SideNav-width)" } }}>
          <TopNav items={layoutConfig.navItems} />
          <Box
            component="main"
            sx={{
              "--Content-margin": "0 auto",
              "--Content-maxWidth": "var(--maxWidth-xl)",
              "--Content-paddingX": "24px",
              "--Content-paddingY": { xs: "24px", lg: "64px" },
              "--Content-padding": "var(--Content-paddingY) var(--Content-paddingX)",
              "--Content-width": "100%",
              display: "flex",
              flex: "1 1 auto",
              flexDirection: "column",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};
