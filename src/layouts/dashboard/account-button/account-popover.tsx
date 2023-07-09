import type { FC } from "react";
import { useCallback } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import CreditCard01Icon from "@untitled-ui/icons-react/build/esm/CreditCard01";
import Settings04Icon from "@untitled-ui/icons-react/build/esm/Settings04";
import User03Icon from "@untitled-ui/icons-react/build/esm/User03";
import {
  Box,
  Button,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  SvgIcon,
  Typography,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { Issuer } from "src/utils/auth";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      onClose?.();

      switch (user?.issuer) {
        case Issuer.Amplify: {
          await user.signOut();
          break;
        }

        case Issuer.Auth0: {
          await user.logout();
          break;
        }

        case Issuer.Firebase: {
          await user.signOut();
          break;
        }

        case Issuer.JWT: {
          await user.signOut();
          break;
        }

        default: {
          console.warn("Using an unknown Auth Issuer, did not log out");
        }
      }

      router.push(paths.index);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  }, [user, router, onClose]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "center",
        vertical: "bottom",
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 200 } }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">{user?.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <Divider sx={{ my: "0 !important" }} />
      <Box
        sx={{
          display: "flex",
          p: 1,
          justifyContent: "center",
        }}
      >
        <Button color="inherit" onClick={handleLogout} size="small">
          Logout
        </Button>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
