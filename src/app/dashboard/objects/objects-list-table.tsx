import type { FC, ChangeEvent, MouseEvent } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import PropTypes from "prop-types";

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { getInitials } from "src/utils/get-initials";
import { useRentalObjectStatusPill } from "src/hooks/use-status-pill";
import { RentalObject } from "prisma/types/objects";
import { getRenterName } from "src/utils/get-renter-name";

interface ObjectListTableProps {
  count?: number;
  items?: RentalObject[];
  onDeselectAll?: () => void;
  onDeselectOne?: (objectId: string) => void;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectAll?: () => void;
  onSelectOne?: (objectId: string) => void;
  page?: number;
  rowsPerPage?: number;
  selected?: string[];
}

export const ObjectListTable: FC<ObjectListTableProps> = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const enableBulkActions = selected.length > 0;

  return (
    <Box sx={{ position: "relative" }}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "neutral.800" : "neutral.50"),
            display: enableBulkActions ? "flex" : "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={(event) => {
              if (event.target.checked) {
                onSelectAll?.();
              } else {
                onDeselectAll?.();
              }
            }}
          />
          <Button color="inherit" size="small">
            Delete
          </Button>
          <Button color="inherit" size="small">
            Edit
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelectAll?.();
                    } else {
                      onDeselectAll?.();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Mieter</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0
              ? items.map((object) => {
                  const isSelected = selected.includes(object.id);
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const statusPill = useRentalObjectStatusPill(object);

                  return (
                    <TableRow hover key={object.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                            if (event.target.checked) {
                              onSelectOne?.(object.id);
                            } else {
                              onDeselectOne?.(object.id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Avatar
                            src={object.image}
                            sx={{
                              height: 42,
                              width: 42,
                            }}
                          >
                            {getInitials(object.name)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              href={`${paths.dashboard.objects.details}${encodeURIComponent(object.id)}`}
                              variant="subtitle2"
                            >
                              {object.name}
                            </Link>
                            <Typography color="text.secondary" variant="body2">
                              {object.name}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell>{statusPill}</TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <AvatarGroup max={3}>
                            {object.renter?.map((renter) => (
                              <Tooltip key={getRenterName(renter.firstname, renter.surname)} title={getRenterName(renter.firstname, renter.surname)}>
                                <Avatar
                                  src={object.image}
                                  sx={{
                                    height: 42,
                                    width: 42,
                                  }}
                                >
                                  {getInitials(getRenterName(renter.firstname, renter.surname))}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton component={RouterLink} href={`${paths.dashboard.objects.edit}${object.id}`}>
                          <SvgIcon>
                            <Edit02Icon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton component={RouterLink} href={`${paths.dashboard.objects.details}/${object.id}`}>
                          <SvgIcon>
                            <ArrowRightIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              : []}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

ObjectListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
