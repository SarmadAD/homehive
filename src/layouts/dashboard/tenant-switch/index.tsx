import type { FC } from "react";
import PropTypes from "prop-types";
import { SxProps } from "@mui/system";
import { Box, Stack, Typography } from "@mui/material";
import { usePopover } from "src/hooks/use-popover";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";

interface TenantSwitchProps {
  sx?: SxProps;
}

export const TenantSwitch: FC<TenantSwitchProps> = (props) => {
  const popover = usePopover<HTMLButtonElement>();

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <RoleBasedGuard permission="showRenterPortalName">
            <Typography color="inherit" variant="h6">
              Mieterportal
            </Typography>
          </RoleBasedGuard>
          <RoleBasedGuard permission="showLandlordPortalName">
            <Typography color="inherit" variant="h6">
              Vermieterportal
            </Typography>
          </RoleBasedGuard>
        </Box>
      </Stack>
    </>
  );
};

TenantSwitch.propTypes = {
  // @ts-ignore
  sx: PropTypes.object,
};
