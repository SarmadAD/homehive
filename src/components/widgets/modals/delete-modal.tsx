import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Warning as WarningIcon } from "@phosphor-icons/react/dist/ssr/Warning";

interface Props {
  setOpenDeleteModal: (open: boolean) => void;
  onDelete: () => void;
  openDeleteModal: boolean;
}

export function DeleteModal({ setOpenDeleteModal, openDeleteModal, onDelete }: Props): React.JSX.Element | null {
  if (!openDeleteModal) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1300,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ border: "1px solid var(--mui-palette-divider)", boxShadow: "var(--mui-shadows-16)", p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ display: "flex" }}>
            <Avatar sx={{ bgcolor: "var(--mui-palette-error-50)", color: "var(--mui-palette-error-main)" }}>
              <WarningIcon fontSize="var(--Icon-fontSize)" />
            </Avatar>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h5">Löschen</Typography>
                <Typography color="text.secondary" variant="body2">
                  Möchten Sie wirklich die ausgewählten Items löschen?
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
                <Button color="secondary" onClick={() => setOpenDeleteModal(false)}>
                  Abbrechen
                </Button>
                <Button color="error" variant="contained" onClick={() => onDelete()}>
                  Löschen
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
