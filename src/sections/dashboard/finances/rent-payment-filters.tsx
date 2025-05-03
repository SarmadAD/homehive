"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { Option } from "src/components/option";
import { paths } from "src/paths";
import { CurrencyEur as CurrencyEurIcon } from "@phosphor-icons/react/dist/ssr/CurrencyEur";
import { Avatar, CardHeader } from "@mui/material";

export type SortDir = "asc" | "desc";

export interface RentPaymentFilters {
  sortDir?: SortDir;
  path: string;
}

export function RentPaymentFilters({ sortDir = "desc", path }: RentPaymentFilters): React.JSX.Element {
  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newSortDir: SortDir): void => {
      const searchParams = new URLSearchParams();

      if (newSortDir === "asc") {
        searchParams.set("sortDir", newSortDir);
      }
      router.push(`${path}?${searchParams.toString()}`);
    },
    [router]
  );

  const handleSortChange = React.useCallback(
    (event: SelectChangeEvent) => {
      updateSearchParams(event.target.value as SortDir);
    },
    [updateSearchParams]
  );

  return (
    <div>
      <Stack direction="row" spacing={5} sx={{ alignItems: "center", flexWrap: "wrap", px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
          <CardHeader
            sx={{ padding: 0 }}
            avatar={
              <Avatar>
                <CurrencyEurIcon fontSize="var(--Icon-fontSize)" />
              </Avatar>
            }
            title="Bezahlte Mieten"
          />
        </Stack>
        <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: "100%", width: "120px" }} value={sortDir}>
          <Option value="desc">Neueste</Option>
          <Option value="asc">Älteste</Option>
        </Select>
      </Stack>
    </div>
  );
}
