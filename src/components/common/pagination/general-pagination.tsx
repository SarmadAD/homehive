"use client";

import * as React from "react";
import { ChangeEvent, MouseEvent } from "react";
import TablePagination from "@mui/material/TablePagination";

interface GeneralPagination {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function GeneralPagination({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: GeneralPagination): React.JSX.Element {
  return (
    <TablePagination
      component="div"
      count={count}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 15]}
      labelRowsPerPage="Zeilen pro Seite"
    />
  );
}
