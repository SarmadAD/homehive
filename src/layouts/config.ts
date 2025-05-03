import { paths } from "src/paths";
import { NavItemConfig } from "src/types/nav";

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [
    {
      key: "",
      title: "",
      items: [
        {
          key: "dashboard",
          title: "Dashboard",
          href: paths.landlordportal.dashboard.index,
          icon: "chart-line-up",
        },
        {
          key: "landlordPortalObjects",
          title: "Objekte",
          href: paths.landlordportal.dashboard.objects.index,
          icon: "house",
        },
        {
          key: "renter",
          title: "Mieter",
          href: paths.landlordportal.dashboard.renters.index,
          icon: "user",
        },
        {
          key: "finances",
          title: "Finanzen",
          href: paths.landlordportal.dashboard.finances.index,
          icon: "hand-coins",
        },
        {
          key: "pricing",
          title: "Preis",
          href: paths.landlordportal.dashboard.pricing,
          icon: "credit-card",
        },
        {
          key: "renterPortalObjects",
          title: "Objekte",
          href: paths.renterportal.dashboard.objects.index,
          icon: "house",
        },
      ],
    },
  ],
} satisfies LayoutConfig;
