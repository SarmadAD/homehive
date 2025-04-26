"use client";

import * as React from "react";
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { Logo } from "src/components/logo";
import { paths } from "src/paths";
import { useUser } from "src/hooks/use-user";
import { NavItemConfig } from "src/types/nav";
import { isNavItemActive } from "src/lib/is-nav-item-active";
import { MobileNav } from "./mobile-nav";

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const { user } = useUser();

  return (
    <React.Fragment>
      <Box
        sx={{
          left: 0,
          position: "sticky",
          right: 0,
          top: 0,
          zIndex: "var(--MainNav-zIndex)",
        }}
      >
        <Container maxWidth="lg" sx={{ display: "flex", minHeight: "var(--MainNav-height)", py: "16px" }}>
          <Logo width={45} height={45} fontSize={17} showLogoName={true} />
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flex: "1 1 auto", justifyContent: "flex-end" }}
          >
            <Button
              component="a"
              href={user ? paths.landlordportal.dashboard.index : paths.auth.firebase.login}
              sx={{ display: { xs: "none", md: "flex" } }}
              variant="contained"
            >
              Dashboard
            </Button>
            <IconButton
              onClick={() => {
                setOpenNav(true);
              }}
              sx={{ color: "var(--mui-palette-common-black)", display: { xs: "flex", md: "none" } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
        </Container>
      </Box>
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}

interface NavItemProps extends Omit<NavItemConfig, "key" | "items"> {
  children?: React.ReactNode;
  pathname: string;
}

export function NavItem({
  children,
  disabled,
  external,
  href,
  matcher,
  pathname,
  title,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const hasPopover = Boolean(children);

  const element = (
    <Box component="li" sx={{ userSelect: "none" }}>
      <Box
        {...(hasPopover
          ? {
              onClick: (event: React.MouseEvent<HTMLElement>): void => {
                event.preventDefault();
              },
              role: "button",
            }
          : {
              ...(href
                ? {
                    component: external ? "a" : RouterLink,
                    href,
                    target: external ? "_blank" : undefined,
                    rel: external ? "noreferrer" : undefined,
                  }
                : { role: "button" }),
            })}
        sx={{
          alignItems: "center",
          borderRadius: 1,
          color: "var(--mui-palette-neutral-300)",
          cursor: "pointer",
          display: "flex",
          flex: "0 0 auto",
          gap: 1,
          p: "6px 16px",
          textAlign: "left",
          textDecoration: "none",
          whiteSpace: "nowrap",
          ...(disabled && {
            bgcolor: "var(--mui-palette-action-disabledBackground)",
            color: "var(--mui-action-disabled)",
            cursor: "not-allowed",
          }),
          ...(active && { color: "var(--mui-palette-common-white)" }),
          "&:hover": {
            ...(!disabled &&
              !active && { bgcolor: "rgba(255, 255, 255, 0.04)", color: "var(--mui-palette-common-white)" }),
          },
        }}
        tabIndex={0}
      >
        <Box component="span" sx={{ flex: "1 1 auto" }}>
          <Typography
            component="span"
            sx={{ color: "inherit", fontSize: "0.875rem", fontWeight: 500, lineHeight: "28px" }}
          >
            {title}
          </Typography>
        </Box>
        {hasPopover ? (
          <Box sx={{ alignItems: "center", color: "inherit", display: "flex", flex: "0 0 auto" }}>
            <CaretDownIcon fontSize="var(--icon-fontSize-sm)" />
          </Box>
        ) : null}
      </Box>
    </Box>
  );

  return element;
}
