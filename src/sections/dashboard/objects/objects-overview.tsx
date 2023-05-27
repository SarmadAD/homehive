import type { FC } from "react";
import numeral from "numeral";
import { format, subMinutes, subSeconds } from "date-fns";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import type { SeverityPillColor } from "src/components/severity-pill";
import { SeverityPill } from "src/components/severity-pill";

const now = new Date();

type ObjectStatus = "inhabited" | "uninhabited";
interface Object {
  id: string;
  createdAt: number;
  name: string;
  renter: {
    email: string;
    name: string;
  };
  status: ObjectStatus;
}

const objects: Object[] = [
  {
    id: "5ecb8a6d9f53bfae09e16115",
    createdAt: subMinutes(subSeconds(now, 23), 32).getTime(),
    name: "Weißes Haus",
    renter: {
      email: "carson.darrin@devias.io",
      name: "Carson Darrin",
    },
    status: "uninhabited",
  },
  {
    id: "5ecb8a738aa6f3e577c2b3ec",
    createdAt: subMinutes(subSeconds(now, 51), 36).getTime(),
    name: "Altes Haus",
    renter: {
      email: "fran.perez@devias.io",
      name: "Fran Perez",
    },
    status: "inhabited",
  },
];

const getStatusPill = (orderStatus: ObjectStatus): JSX.Element => {
  const map: Record<ObjectStatus, { color: SeverityPillColor; text: string }> = {
    inhabited: {
      color: "success",
      text: "Bewohnt",
    },
    uninhabited: {
      color: "info",
      text: "Unbewohnt",
    },
  };

  const { text, color } = map[orderStatus];

  return <SeverityPill color={color}>{text}</SeverityPill>;
};

export const ObjectsOverview: FC = () => (
  <Box>
    <Card>
      <CardHeader
        action={
          <IconButton>
            <SvgIcon>
              <DotsHorizontalIcon />
            </SvgIcon>
          </IconButton>
        }
        title="Objekte"
      />
      <Divider />
      <Scrollbar>
        <Table sx={{ minWidth: 1150 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Mieter</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {objects.map((object) => {
              const createdAt = format(object.createdAt, "dd MMM yyyy | HH:mm");
              const statusPill = getStatusPill(object.status);

              return (
                <TableRow hover key={object.id}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{object.name}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>{statusPill}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{object.renter.name}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {object.renter.email}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <SvgIcon>
                        <Edit02Icon />
                      </SvgIcon>
                    </IconButton>
                    <IconButton>
                      <SvgIcon>
                        <ArrowRightIcon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={objects.length}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        page={0}
        rowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  </Box>
);
