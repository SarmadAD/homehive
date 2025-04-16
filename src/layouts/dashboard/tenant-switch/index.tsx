import type { FC } from "react";
import PropTypes from "prop-types";
import { SxProps } from "@mui/system";
import { Box, Stack, Typography } from "@mui/material";
import { RoleBasedGuard } from "src/app/auth/role/RoleBasedGuard";

interface TenantSwitchProps {
  sx?: SxProps;
}

export const TenantSwitch: FC<TenantSwitchProps> = (props) => {
  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <RoleBasedGuard permission="showRenterPortalName">
            <Typography color="inherit" variant="h6">
              HomeHive
            </Typography>
            <Typography color="neutral.400" variant="body2">
              Mieterportal
            </Typography>
          </RoleBasedGuard>
          <RoleBasedGuard permission="showLandlordPortalName">
            <Typography color="inherit" variant="h6">
              HomeHive
            </Typography>
            <Typography color="neutral.400" variant="body2">
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
