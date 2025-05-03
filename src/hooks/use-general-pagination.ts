import { useCallback, useState, ChangeEvent, MouseEvent, useEffect, useMemo } from "react";

export interface GeneralPaginationState {
  page: number;
  rowsPerPage: number;
}

export const useGeneralPagination = () => {
  const [state, setState] = useState<GeneralPaginationState>({
    page: 0,
    rowsPerPage: 5,
  });

  const handlePageChange = useCallback((event: MouseEvent<HTMLButtonElement> | null, page: number): void => {
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  }, []);

  return {
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};
