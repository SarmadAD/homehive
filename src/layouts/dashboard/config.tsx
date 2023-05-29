import type { ReactNode } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Chip, SvgIcon } from "@mui/material";
import HomeSmileIcon from "src/icons/untitled-ui/duocolor/home-smile";
import { tokens } from "src/locales/tokens";
import { paths } from "src/paths";
import { Person } from "@mui/icons-material";
import { LineChartUp01 } from "@untitled-ui/icons-react";

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
  items: Item[];
  subheader?: string;
}

export const useSections = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: t(tokens.nav.dashboard),
            path: paths.dashboard.index,
            icon: (
              <SvgIcon fontSize="small">
                <LineChartUp01 />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.objects),
            path: paths.dashboard.objects.index,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmileIcon />
              </SvgIcon>
            ),
          },
          {
            title: t(tokens.nav.renter),
            path: paths.dashboard.renters.index,
            icon: (
              <SvgIcon fontSize="small">
                <Person />
              </SvgIcon>
            ),
          },
        ],
      },
    ];
  }, [t]);
};
