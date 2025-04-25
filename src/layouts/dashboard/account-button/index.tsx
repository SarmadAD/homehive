import type { FC } from "react";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";
import { Avatar, Badge, Box, ButtonBase, SvgIcon } from "@mui/material";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import { useUser } from "src/hooks/use-user";

export const AccountButton: FC = () => {
  const { user, error } = useUser();
  const popover = usePopover<HTMLButtonElement>();

  return (
    <>
      <Box
        component="button"
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{ border: "none", background: "transparent", cursor: "pointer", p: 0 }}
      >
        <Badge
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          color="success"
          sx={{
            "& .MuiBadge-dot": {
              border: "2px solid var(--MainNav-background)",
              borderRadius: "50%",
              bottom: "6px",
              height: "12px",
              right: "6px",
              width: "12px",
            },
          }}
          variant="dot"
        >
          <Avatar src={user?.avatar} />
        </Badge>
      </Box>
      <AccountPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
    </>
  );
};
