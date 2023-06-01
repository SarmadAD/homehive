export interface RepairRequestsSearchState {
  filters: Filters;
  page: number;
  rowsPerPage: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface Filters {
  query?: string;
}
