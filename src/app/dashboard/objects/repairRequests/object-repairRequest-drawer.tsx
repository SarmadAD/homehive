import type { FC } from "react";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import type { Theme } from "@mui/material";
import { Box, Drawer, IconButton, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { RepairRequestDetails } from "./repairRequest-details";
import { RepairRequest } from "prisma/types/repairRequest";

interface ObjectRepairRequestDrawerProps {
  container?: HTMLDivElement | null;
  open?: boolean;
  onClose?: () => void;
  handleAcceptRepairRequest: () => void;
  handleRejectRepairRequest: () => void;
  repairRequest?: RepairRequest;
}

export const ObjectRepairRequestDrawer: FC<ObjectRepairRequestDrawerProps> = (props) => {
  const { container, onClose, open, repairRequest, handleAcceptRepairRequest, handleRejectRepairRequest } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const handleEditOpen = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  let content: JSX.Element | null = null;

  if (repairRequest) {
    content = (
      <div>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Typography color="inherit" variant="h6">
            {repairRequest.name}
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <Box
          sx={{
            px: 3,
            py: 4,
          }}
        >
          <RepairRequestDetails
            onEdit={handleEditOpen}
            repairRequest={repairRequest}
            handleAcceptRepairRequest={handleAcceptRepairRequest}
            handleRejectRepairRequest={handleRejectRepairRequest}
          />
          {/* {!isEditing ? (
            <OrderDetails onApprove={onClose} onEdit={handleEditOpen} onReject={onClose} order={order} />
          ) : (
            <OrderEdit onCancel={handleEditCancel} onSave={handleEditCancel} order={order} />
          )} */}
        </Box>
      </div>
    );
  }

  if (lgUp) {
    return (
      <Drawer
        anchor="right"
        open={open}
        PaperProps={{
          sx: {
            position: "relative",
            width: 500,
          },
        }}
        SlideProps={{ container }}
        variant="persistent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      hideBackdrop
      ModalProps={{
        container,
        sx: {
          pointerEvents: "none",
          position: "absolute",
        },
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: 400,
          pointerEvents: "auto",
          position: "absolute",
        },
      }}
      SlideProps={{ container }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

ObjectRepairRequestDrawer.propTypes = {
  container: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  repairRequest: PropTypes.object,
};
