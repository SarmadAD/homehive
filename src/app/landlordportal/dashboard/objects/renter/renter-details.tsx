import { FC } from "react";
import PropTypes from "prop-types";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import { Autocomplete, TextField, Theme } from "@mui/material";
import { Button, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
// import { useRentPaidStatusPill } from "src/hooks/use-status-pill";
import { DueDateOfRent } from "@prisma/client";
import { Renter } from "prisma/types/renter";
import { RentPaymentList } from "./rent-payment-list";

interface RenterDetailsProps {
  onEdit?: () => void;
  onPaid?: () => void;
  renter: Renter;
}

export const RenterDetails: FC<RenterDetailsProps> = (props) => {
  const { onEdit, renter, onPaid } = props;

  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const align = lgUp ? "horizontal" : "vertical";

  function handleDueDateChange(event: React.SyntheticEvent, dueDate: OptionDueDate | null) {
    if (dueDate) {
      setNewObject({
        ...newObject,
        rentalObjectInfo: {
          ...newObject?.rentalObjectInfo,
        },
      });
    }
  }

  type OptionDueDate = {
    label: string;
    value: DueDateOfRent;
  };

  const dueDateOfRentList: OptionDueDate[] = [
    {
      label: "Zum 1 des Monats",
      value: DueDateOfRent.FIRSTMONTH,
    },
    {
      label: "Zum 15 des Monats",
      value: DueDateOfRent.MIDDLEMONTH,
    },
    {
      label: "Zum 27 des Monats",
      value: DueDateOfRent.ENDMONTH,
    },
  ];

  // const statusPill = useRentPaidStatusPill(renter.status);
  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={3}>
          <Typography variant="h6">Details</Typography>
          <Button
            color="inherit"
            onClick={onEdit}
            size="small"
            startIcon={
              <SvgIcon>
                <Edit02Icon />
              </SvgIcon>
            }
          >
            Edit
          </Button>
        </Stack>
        <PropertyList>
          <PropertyListItem align={align} disableGutters divider label="Kontaktdaten">
            <Typography color="text.secondary" variant="body2">
              {renter.email}
            </Typography>
          </PropertyListItem>{" "}
          <PropertyListItem disableGutters divider label="">
            <Autocomplete
              onChange={handleDueDateChange}
              getOptionLabel={(option: OptionDueDate) => option.label}
              options={dueDateOfRentList}
              value={dueDateOfRentList.find((x) => x.value === renter.rentalAgreement?.dueDateState)}
              renderInput={(params): JSX.Element => (
                <TextField {...params} fullWidth label="Fälligkeit der Miete" name="dueDate" />
              )}
            />{" "}
          </PropertyListItem>
          <PropertyListItem disableGutters divider label="">
            {renter.rentPayment && renter.rentPayment.length > 0 ? (
              <RentPaymentList renter={renter} />
            ) : (
              <Typography color="text.secondary" variant="body2">
                Es wurden noch keine Mietzahlungen getätigt.
              </Typography>
            )}
          </PropertyListItem>
        </PropertyList>
        <Stack alignItems="center" direction="row" flexWrap="wrap" justifyContent="flex-end" spacing={2}>
          <Button onClick={onPaid} size="small" variant="contained">
            Bezahlt
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

RenterDetails.propTypes = {
  onEdit: PropTypes.func,
  // @ts-ignore
  renter: PropTypes.object,
};
