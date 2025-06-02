import { FC } from "react";
import { Controller, Control } from "react-hook-form";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DueDateOfRent } from "@prisma/client";

interface DueDateSelectProps {
  control: Control<any>;
  name?: string;
  label?: string;
}

const dueDateOptions = [
  { value: DueDateOfRent.FIRSTMONTH, label: "Zum 1. des Monats" },
  { value: DueDateOfRent.MIDDLEMONTH, label: "Zum 15. des Monats" },
  { value: DueDateOfRent.ENDMONTH, label: "Zum 27. des Monats" },
];

export const DueDateSelect: FC<DueDateSelectProps> = ({ control, name = "dueDate", label = "Fälligkeit der Miete" }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FormControl fullWidth error={!!fieldState.error}>
        <InputLabel id="due-date-select-label">{label}</InputLabel>
        <Select labelId="due-date-select-label" label={label} {...field} value={field.value || ""} displayEmpty>
          <MenuItem value="" disabled>
            Bitte Fälligkeit auswählen
          </MenuItem>
          {dueDateOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {fieldState.error && (
          <Typography color="error" variant="caption">
            {fieldState.error.message}
          </Typography>
        )}
      </FormControl>
    )}
  />
);
