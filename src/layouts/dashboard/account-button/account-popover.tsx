import type { FC } from "react";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Box, Button, Divider, List, ListItemIcon, MenuItem, Popover, Typography } from "@mui/material";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { Issuer } from "src/utils/auth";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { useUser } from "src/hooks/use-user";
import { RouterLink } from "src/components/router-link";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "src/lib/default-logger";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const [supabaseClient] = useState<SupabaseClient>(createSupabaseClient());

  const { user } = useUser();

  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        logger.error("Sign out error", error);
        toast.error("Something went wrong, unable to sign out");
      } else {
        // UserProvider will handle Router refresh
        // After refresh, GuestGuard will handle the redirect
      }
    } catch (err) {
      logger.error("Sign out error", err);
      toast.error("Something went wrong, unable to sign out");
    }
  }, [supabaseClient]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: "250px" } } }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">{user?.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      {/* <Divider sx={{ my: "0 !important" }} /> */}
      <List sx={{ p: 1 }}>
        <RoleBasedGuard permission="/landlordportal/dashboard">
          <MenuItem component={RouterLink} href={paths.landlordportal.dashboard.settings.account} onClick={onClose}>
            <ListItemIcon>
              <UserIcon />
            </ListItemIcon>
            Kontoeinstellungen
          </MenuItem>
        </RoleBasedGuard>
        <RoleBasedGuard permission="/renterportal/dashboard">
          <MenuItem component={RouterLink} href={paths.renterportal.dashboard.settings.account} onClick={onClose}>
            <ListItemIcon>
              <UserIcon />
            </ListItemIcon>
            Kontoeinstellungen
          </MenuItem>
        </RoleBasedGuard>
      </List>
      <Divider />

      <Box sx={{ p: 1 }}>
        <MenuItem component="div" onClick={handleSignOut} sx={{ justifyContent: "center" }}>
          Abmelden
        </MenuItem>
      </Box>
    </Popover>
  );
};
