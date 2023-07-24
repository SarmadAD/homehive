"use client";

import type { FC, ReactNode } from "react";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import Cookies from "js-cookie";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { RTL } from "src/components/rtl";
import { SplashScreen } from "src/components/splash-screen";
import { SettingsButton } from "src/components/settings/settings-button";
import { SettingsDrawer } from "src/components/settings/settings-drawer";
import { Toaster } from "src/components/toaster";
import { gtmConfig } from "src/config";
import { useAnalytics } from "src/hooks/use-analytics";
import { useNProgress } from "src/hooks/use-nprogress";
import { store } from "src/store";
import { createTheme } from "src/theme";
import type { Settings } from "src/types/settings";
import { RecoilRoot } from "recoil";
import { AuthConsumer } from "src/contexts/auth/firebase/auth-consumer";
import { AuthProvider } from "src/contexts/auth/firebase/auth-provider";
import { SettingsConsumer, SettingsProvider } from "src/contexts/settings/settings-context";

// Remove if locales are not used
import "src/locales/i18n";

interface LayoutProps {
  children: ReactNode;
  settings?: Settings;
}

export const Layout: FC<LayoutProps> = (props: LayoutProps) => {
  const { children, settings } = props;

  useAnalytics(gtmConfig);
  useNProgress();

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
      <ReduxProvider store={store}>
        <RecoilRoot>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AuthProvider>
              <AuthConsumer>
                {(auth) => (
                  <SettingsProvider>
                    <SettingsConsumer>
                      {(settings) => {
                        // Prevent theme flicker when restoring custom settings from browser storage
                        if (!settings.isInitialized) {
                          // return null;
                        }
                        const theme = createTheme({
                          colorPreset: settings.colorPreset,
                          contrast: settings.contrast,
                          direction: settings.direction,
                          paletteMode: settings.paletteMode,
                          responsiveFontSizes: settings.responsiveFontSizes,
                        });

                        // Prevent guards from redirecting
                        const showSlashScreen = !auth.isInitialized;

                        return (
                          <ThemeProvider theme={theme}>
                            <Head>
                              <meta name="color-scheme" content={settings.paletteMode} />
                              <meta name="theme-color" content={theme.palette.neutral[900]} />
                            </Head>
                            <RTL direction={settings.direction}>
                              <CssBaseline />
                              {showSlashScreen ? (
                                <SplashScreen />
                              ) : (
                                <>
                                  {children}
                                  <SettingsButton onClick={settings.handleDrawerOpen} />
                                  <SettingsDrawer
                                    canReset={settings.isCustom}
                                    onClose={settings.handleDrawerClose}
                                    onReset={settings.handleReset}
                                    onUpdate={settings.handleUpdate}
                                    open={settings.openDrawer}
                                    values={{
                                      colorPreset: settings.colorPreset,
                                      contrast: settings.contrast,
                                      direction: settings.direction,
                                      paletteMode: settings.paletteMode,
                                      responsiveFontSizes: settings.responsiveFontSizes,
                                      stretch: settings.stretch,
                                      layout: settings.layout,
                                      navColor: settings.navColor,
                                    }}
                                  />
                                </>
                              )}
                              <Toaster />
                            </RTL>
                          </ThemeProvider>
                        );
                      }}
                    </SettingsConsumer>
                  </SettingsProvider>
                )}
              </AuthConsumer>
            </AuthProvider>
          </LocalizationProvider>
        </RecoilRoot>
      </ReduxProvider>
    </NextAppDirEmotionCacheProvider>
  );
};
