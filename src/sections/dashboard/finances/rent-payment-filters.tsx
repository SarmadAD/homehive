"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { Option } from "src/components/option";
import { CurrencyEur as CurrencyEurIcon } from "@phosphor-icons/react/dist/ssr/CurrencyEur";
import { Avatar, Button, CardHeader, Link, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import agent from "src/api/agent";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { paths } from "src/paths";
import { RouterLink } from "src/components/router-link";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";

export type SortDir = "asc" | "desc";

export interface RentPaymentFilters {
  sortDir?: SortDir;
  path: string;
  handleRefreshPayments: () => void;
  showFilters: boolean;
  isLoadingPayments: boolean;
}

export function RentPaymentFilters({
  sortDir = "desc",
  path,
  handleRefreshPayments,
  isLoadingPayments,
  showFilters,
}: RentPaymentFilters): React.JSX.Element {
  const router = useRouter();
  const landlord = useRecoilValue(currentLandlordAtom);
  const [isTokenAlive, setIsTokenAlive] = useState(false);

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

  useEffect(() => {
    if (landlord.id) {
      checkIfTokenIsAlive();
    }
  }, [landlord.id]);

  async function checkIfTokenIsAlive() {
    try {
      const response: any = await agent.token.get(landlord.id);
      setIsTokenAlive(response.isAlive);
    } catch (error) {
      console.log(error);
    }
  }

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
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {/* <Tooltip
            title={
              !isTokenAlive ? (
                <span>
                  Bankverbindung erneuern:{" "}
                  <Link component={RouterLink} href={paths.landlordportal.dashboard.settings.integrations} style={{ textDecoration: "none" }}>
                    Erneut anmelden
                  </Link>
                </span>
              ) : (
                ""
              )
            }
            disableHoverListener={isTokenAlive}
            arrow
          >
            <span>
              <Button
                sx={{
                  minWidth: 0,
                  px: 1,
                  "&:hover .refresh-contrast": {
                    color: "primary.light",
                  },
                }}
                onClick={() => handleRefreshPayments()}
                title="Aktualisieren"
                disabled={!isTokenAlive || isLoadingPayments}
              >
                <RefreshIcon className="refresh-contrast" />
              </Button>
            </span>
          </Tooltip> */}
          {showFilters && (
            <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: "100%", width: "120px" }} value={sortDir}>
              <Option value="desc">Neueste</Option>
              <Option value="asc">Älteste</Option>
            </Select>
          )}
        </Stack>
      </Stack>
    </div>
  );
}
