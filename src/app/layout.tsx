"use client";

// Remove if react-quill is not used
import "react-quill/dist/quill.snow.css";
// Remove if react-draft-wysiwyg is not used
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// Remove if simplebar is not used
import "simplebar-react/dist/simplebar.min.css";
// Remove if mapbox is not used
import "mapbox-gl/dist/mapbox-gl.css";

import "../styles/global.css";

import { type FC, type ReactNode } from "react";
import { cookies } from "next/headers";

// import { Layout as RootLayout } from "src/layouts/root";

import type { Viewport } from "next/types";

import type { Settings } from "src/types/settings";
import { Analytics } from "@vercel/analytics/next";
import { applyDefaultSettings } from "src/lib/settings/apply-default-settings";
import { getSettings as getPersistedSettings } from "../lib/settings/get-settings";
import { site } from "src/config";
import { LocalizationProvider } from "src/components/localization-provider";
import { Toaster } from "src/components/toaster";
import { RecoilRoot } from "recoil";
import { UserProvider } from "src/contexts/auth/user-context";
import { SettingsProvider } from "src/contexts/settings";
import { ThemeProvider } from "src/components/widgets/core/theme-provider/theme-provider";

// Force-Dynamic is required otherwise all pages are marked as client-side
// due to the usage of the "cookies" function.
export const dynamic = "force-dynamic";

const Favicon: FC = () => (
  <>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  </>
);

const Fonts: FC = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
    />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400&display=swap" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&display=swap"
    />
  </>
);

const Vendors: FC = () => (
  <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
  </>
);

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.themeColor,
} satisfies Viewport;

const SETTINGS_STORAGE_KEY = "app.settings";

// const restoreSettings = (): Settings | undefined => {
//   const cookieList = cookies();

//   let value: Settings | undefined;

//   if (cookieList.has(SETTINGS_STORAGE_KEY)) {
//     try {
//       const restored = cookieList.get(SETTINGS_STORAGE_KEY);

//       if (restored) {
//         value = JSON.parse(restored!.value);
//       }
//     } catch (err) {
//       console.error(err);
//       // If stored data is not a strigified JSON this will fail,
//       // that's why we catch the error
//     }
//   }

//   return value;
// };

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps): Promise<React.JSX.Element> {
  // const { children } = props;
  // const settings = restoreSettings();
  // const settings = applyDefaultSettings(await getPersistedSettings());

  const defaultSettings = applyDefaultSettings({});

  return (
    <html data-mui-color-scheme={defaultSettings.colorScheme} lang="de">
      <head>
        <title>HomeHive</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <Favicon />
        <Fonts />
        <Vendors />
      </head>
      <body>
        {/* <RootLayout settings={settings}>{children}</RootLayout> <Analytics /> */}

        <RecoilRoot>
          <LocalizationProvider>
            <UserProvider>
              {/* <SettingsProvider settings={settings}> */}
              <SettingsProvider settings={defaultSettings}>
                {/* <I18nProvider language="en"> */}
                <ThemeProvider>
                  {children}
                  {/* <SettingsButton /> */}
                  <Toaster position="bottom-right" />
                </ThemeProvider>
                {/* </I18nProvider> */}
              </SettingsProvider>
            </UserProvider>
          </LocalizationProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
