import { useState, type FC } from "react";
import PropTypes from "prop-types";
import Menu01Icon from "@untitled-ui/icons-react/build/esm/Menu01";
import type { Theme } from "@mui/material/styles/createTheme";
import { Box, IconButton, Stack, SvgIcon, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/system/colorManipulator";
import { AccountButton } from "../account-button";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MobileNav } from "../mobile-nav";
import { NavItemConfig } from "src/types/nav";

const TOP_NAV_HEIGHT: number = 64;
const SIDE_NAV_WIDTH: number = 280;

export interface MainNavProps {
  items: NavItemConfig[];
}

export const TopNav: FC<MainNavProps> = (props) => {
  const { items, ...other } = props;
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const [openNav, setOpenNav] = useState<boolean>(false);

  return (
    <>
      <Box
        component="header"
        sx={{
          "--MainNav-background": "var(--mui-palette-background-default)",
          // "--MainNav-divider": "var(--mui-palette-divider)",
          bgcolor: "var(--MainNav-background)",
          left: 0,
          position: "sticky",
          pt: { lg: "var(--Layout-gap)" },
          top: 0,
          width: "100%",
          zIndex: "var(--MainNav-zIndex)",
        }}
        // {...other}
      >
        <Box
          sx={{
            borderBottom: "1px solid var(--MainNav-divider)",
            display: "flex",
            flex: "1 1 auto",
            minHeight: "var(--MainNav-height)",
            px: { xs: 2, lg: 3 },
            py: 1,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto" }}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: "none" } }}
            >
              <ListIcon />
            </IconButton>
            {/* <SearchButton /> */}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flex: "1 1 auto", justifyContent: "flex-end" }}
          >
            <AccountButton />
          </Stack>
        </Box>
      </Box>
      <MobileNav
        items={items}
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </>
  );
};
