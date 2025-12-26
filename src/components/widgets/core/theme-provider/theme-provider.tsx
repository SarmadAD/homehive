"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import EmotionCache from "./emotion-cache";
import { Rtl } from "./rtl";
import { useSettings } from "src/hooks/use-settings";
import { createTheme } from "src/styles/theme/create-theme";
import { CssVarsProvider } from "@mui/material";

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const { settings } = useSettings();

  const theme = createTheme({
    primaryColor: settings.primaryColor,
    colorScheme: settings.colorScheme,
    direction: settings.direction,
  });

  return (
    <EmotionCache options={{ key: "mui" }}>
      <CssVarsProvider defaultColorScheme={settings.colorScheme} defaultMode={settings.colorScheme} theme={theme}>
        <CssBaseline />
        <Rtl direction={settings.direction}>{children}</Rtl>
      </CssVarsProvider>
    </EmotionCache>
  );
}
