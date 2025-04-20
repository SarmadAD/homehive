import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { Dispatch, useState } from "react";
import { useRecoilValue } from "recoil";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { Renter } from "prisma/types/renter";
import { getRenterName } from "src/utils/get-renter-name";
import { PlusCircle } from "@untitled-ui/icons-react";
import { RentalObject } from "prisma/types/objects";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";

interface Props {
  setOpenAddRenterModal: (open: boolean) => void;
  onAddRenter: (selectedRenterId: string) => void;
  openAddRenterModal: boolean;
  renters: Renter[];
  rentalObject: RentalObject;
}

export function AddRenterModal({
  setOpenAddRenterModal,
  openAddRenterModal,
  onAddRenter,
  renters,
  rentalObject,
}: Props): React.JSX.Element | null {
  //   const rentalObject = useRecoilValue(rentalObjectAtom);

  //   const [currentObject, setCurrentObject] = useState<RentalObject>(rentalObject);
  const [selectedRenterId, setSelectedRenterId] = useState<string>("");

  function handleRenterChange(event: SelectChangeEvent<string>) {
    const renterId = event.target.value as string;
    const selectedRenter = renters.find((renter) => renter.id === renterId);

    if (selectedRenter) {
      //   const updatedRenters = currentObject.renter ? [...currentObject.renter, selectedRenter] : [selectedRenter];
      //   setCurrentObject({ ...currentObject, renter: updatedRenters });
      setSelectedRenterId(renterId);
    }
  }

  if (!openAddRenterModal) {
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
          <Stack spacing={2} sx={{ display: "flex" }}>
            <Stack spacing={3} direction="column">
              <div>
                <Typography variant="h6">Füge einen Mieter zu dem Objekt hinzu</Typography>
              </div>
              <FormControl fullWidth>
                <InputLabel id="renter-select-label">Mieter</InputLabel>
                <Select
                  labelId="renter-select-label"
                  value={selectedRenterId}
                  onChange={handleRenterChange}
                  label="Mieter"
                >
                  {renters.filter(
                    (renter) => !rentalObject.renter?.some((assignedRenter) => assignedRenter.id === renter.id)
                  ).length === 0 ? (
                    <MenuItem disabled>Keine Mieter verfügbar. Bitte löschen oder erstellen Sie Mieter. </MenuItem>
                  ) : (
                    renters
                      .filter(
                        (renter) => !rentalObject.renter?.some((assignedRenter) => assignedRenter.id === renter.id)
                      )
                      .map((renter) => (
                        <MenuItem key={renter.id} value={renter.id}>
                          {getRenterName(renter.firstname, renter.surname)}
                        </MenuItem>
                      ))
                  )}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
              <Button
                color="secondary"
                onClick={() => {
                  setOpenAddRenterModal(false);
                  setSelectedRenterId("");
                }}
              >
                Abbrechen
              </Button>
              <Button
                color="primary"
                variant="contained"
                disabled={!selectedRenterId}
                onClick={() => {
                  onAddRenter(selectedRenterId);
                  setSelectedRenterId("");
                }}
              >
                Hinzufügen
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
