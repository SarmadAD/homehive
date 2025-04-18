import type { FC } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Logo } from "src/components/logo";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { NavItemConfig } from "src/types/nav";

interface GroupConfig {
  key: string;
  title: string;
  items: NavItemConfig[];
}

const groups = [
  // {
  //   key: "menu",
  //   title: "Menu",
  //   items: [
  //     { key: "dashboard", title: "Dashboard", href: paths.landlordportal.dashboard.index },
  //     { key: "documentation", title: "Documentation", external: true, href: paths.docs },
  //   ],
  // },
  // {
  //   key: "legal",
  //   title: "Legal",
  //   items: [
  //     { key: "terms-and-conditions", title: "Terms & Conditions" },
  //     { key: "privacy-policy", title: "License" },
  //     { key: "contact", title: "Contact" },
  //   ],
  // },
  // {
  //   key: "social",
  //   title: "Social",
  //   items: [
  //     { key: "instagram", title: "Instagram" },
  //     { key: "linkedin", title: "LinkedIn" },
  //   ],
  // },
] satisfies GroupConfig[];

const date = new Date();
const year = date.getFullYear();

export function Footer(): React.JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "var(--mui-palette-background-default)",
        borderTop: "1px solid var(--mui-palette-divider)",
        pb: 6,
        pt: { md: 15, xs: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid md={3} sm={4} sx={{ order: { xs: 4, md: 1 } }} xs={12}>
            <Stack spacing={1}>
              <Stack
                alignItems="center"
                component={RouterLink}
                direction="row"
                display="inline-flex"
                href={paths.index}
                spacing={1}
                sx={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    height: 24,
                    width: 24,
                  }}
                >
                  <Logo />
                </Box>
                <Box
                  sx={{
                    color: "text.primary",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
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
              </Stack>
              <Typography color="text.secondary" variant="caption">
                © {year} HomeHive
              </Typography>
            </Stack>
          </Grid>
          {groups.map((section, index) => (
            <Grid key={section.key} md={3} sm={4} sx={{ order: { md: index + 2, xs: index + 1 } }} xs={12}>
              <Typography color="text.secondary" variant="overline">
                {section.title}
              </Typography>
              <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
                {section.items.map((item) => (
                  <NavItem {...item} key={item.key} />
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 6 }} />
        <Typography color="text.secondary" variant="caption">
          All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
}

interface NavItemProps extends NavItemConfig {}

function NavItem({ href, external, title }: NavItemProps): React.JSX.Element {
  return (
    <Stack direction="row" key={title} spacing={2} sx={{ alignItems: "center" }}>
      <Box sx={{ bgcolor: "var(--mui-palette-primary-main)", height: "2px", width: "12px" }} />
      <Link
        {...(href ? (external ? { component: "a", href, target: "_blank" } : { component: RouterLink, href }) : {})}
        color="text.primary"
        variant="subtitle2"
      >
        {title}
      </Link>
    </Stack>
  );
}
