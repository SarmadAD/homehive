"use client";

import { Box } from "@mui/material";
import type { FC } from "react";
import { paths } from "src/paths";
import { RouterLink } from "./router-link";

interface LogoProps {
  width?: number;
  height?: number;
  fontSize?: number;
  showLogoName?: boolean;
  showLogo?: boolean;
}

export function Logo({ width, height, fontSize, showLogoName }: LogoProps) {
  return (
    <Box alignItems="center" component={RouterLink} display="inline-flex" href={paths.index} sx={{ textDecoration: "none" }} mr={0.5}>
      <Box
        component="img"
        mr={0.5}
        sx={{
          display: "inline-flex",
          width: { width },
          height: { height },
        }}
        src="/assets/HomeHive-logo-transparent.png"
      />
      {showLogoName && (
        <Box
          sx={{
            color: "text.primary",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: { fontSize },
            fontWeight: 800,
            letterSpacing: "0.3px",
            lineHeight: 2.5,
            "& span": {
              color: "primary.main",
            },
          }}
        >
          Home<span>Hive</span>
        </Box>
      )}
    </Box>
  );
}
