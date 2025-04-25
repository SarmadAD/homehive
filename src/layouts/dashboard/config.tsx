import type { ReactNode } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Chip, SvgIcon } from "@mui/material";
import HomeSmileIcon from "src/icons/untitled-ui/duocolor/home-smile";
import { tokens } from "src/locales/tokens";
import { paths } from "src/paths";
import { Person } from "@mui/icons-material";
import { LineChartUp01 } from "@untitled-ui/icons-react";
import { NavItemConfig } from "src/types/nav";

export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: NavItemConfig[];
  subheader?: string;
}

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const useSections = (): { items: NavItemConfig[] }[] => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: t(tokens.nav.dashboard),
            key: "dashboard",
            href: paths.landlordportal.dashboard.index,
            icon: "chart-line-up",
          },
          {
            title: t(tokens.nav.objects),
            key: "landlordPortalObjects",
            href: paths.landlordportal.dashboard.objects.index,
            icon: "house",
          },
          {
            title: t(tokens.nav.renter),
            key: "renter",
            href: paths.landlordportal.dashboard.renters.index,
            icon: "person",
          },

          {
            title: t(tokens.nav.objects),
            key: "renterPortalObjects",
            href: paths.renterportal.dashboard.objects.index,
            icon: "house",
          },
        ] as NavItemConfig[],
      },
    ];
  }, [t]);
};
