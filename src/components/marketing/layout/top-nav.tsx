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
import agent from "src/api/agent";
import { useCallback, useEffect, useState } from "react";
import { logger } from "src/lib/default-logger";
import { useWindowScroll } from "src/hooks/use-window-scroll";

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [rederict, setRederict] = useState<string>("");
  const { user } = useUser();

  const [elevate, setElevate] = useState<boolean>(false);
  const offset = 64;
  const delay = 100;

  const handleWindowScroll = useCallback((): void => {
    if (window.scrollY > offset) {
      setElevate(true);
    } else {
      setElevate(false);
    }
  }, []);

  useWindowScroll({
    handler: handleWindowScroll,
    delay,
  });
  async function checkIfUserIsLandlord() {
    let result = false;
    try {
      const authenticatedUserId = user?.id;
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
        if ("error" in landlord) {
          throw new Error(String(landlord.error));
        } else {
          result = true;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return result;
  }

  async function checkIfRenterExistsWithAuthenticatedUserId() {
    let result = false;
    try {
      const authenticatedUserId = user?.id;
      const renter = await agent.renter.details(authenticatedUserId);
      if ("error" in renter) {
        throw new Error(String(renter.error));
      } else {
        result = true;
      }
    } catch (error) {
      console.error(error);
    }
    return result;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        if (await checkIfRenterExistsWithAuthenticatedUserId()) {
          logger.debug("[GuestGuard]: User is logged in, redirecting to renter portal");
          setRederict(paths.renterportal.dashboard.objects.index);
        } else if (await checkIfUserIsLandlord()) {
          logger.debug("[GuestGuard]: User is logged in, redirecting to landlord portal");
          setRederict(paths.landlordportal.dashboard.index);
        }
      }
    };

    fetchData();
  }, [user]);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          left: 0,
          position: "fixed",
          right: 0,
          top: 0,
          pt: 2,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            backdropFilter: "blur(6px)",
            backgroundColor: "transparent",
            borderRadius: 2.5,
            boxShadow: "none",
            transition: (theme) =>
              theme.transitions.create("box-shadow, background-color", {
                easing: theme.transitions.easing.easeInOut,
                duration: 200,
              }),
            ...(elevate && {
              backgroundColor: "white",
              boxShadow: 8,
            }),
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flex: "1 1 auto", p: 1, justifyContent: "space-between" }}
          >
            <Logo width={45} height={45} fontSize={17} showLogoName={true} />
            {user ? (
              <Button component="a" href={rederict} sx={{ display: { xs: "none", md: "flex" } }} variant="contained">
                Dashboard
              </Button>
            ) : (
              <Button
                component="a"
                href={paths.auth.supabase.signIn}
                sx={{ display: { xs: "none", md: "flex" } }}
                variant="contained"
              >
                Einloggen
              </Button>
            )}
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
