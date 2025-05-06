"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PlugsConnected as PlugsConnectedIcon } from "@phosphor-icons/react/dist/ssr/PlugsConnected";
import { Bank as BankIcon } from "@phosphor-icons/react/dist/ssr/Bank";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { useEffect, useState } from "react";
import agent from "src/api/agent";
import { useRecoilValue } from "recoil";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";

export interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
}

export interface IntegrationsProps {
  integrations: Integration[];
}

export function Integrations({ integrations }: IntegrationsProps): React.JSX.Element {
  const landlord = useRecoilValue(currentUserAtom);
  const [connected, setConnected] = useState(false);
  const tinkLink =
    process.env.NODE_ENV === "production"
      ? `https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.NEXT_PUBLIC_TINK_CLIENT_ID}&redirect_uri=https%3A%2F%2Fhomehive.me%2Flandlordportal%2Fdashboard%2Fsettings%2Fintegrations&market=DE&locale=de_DE`
      : `https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.NEXT_PUBLIC_TINK_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flandlordportal%2Fdashboard%2Fsettings%2Fintegrations&market=DE&locale=de_DE`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = new URLSearchParams(window.location.search);
        const code = query.get("code");
        if (code && landlord.id) {
          await agent.tinkToken.generate(code, landlord.id);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    fetchIntegrationStatus();
  }, [landlord.id]);

  const fetchIntegrationStatus = async () => {
    try {
      if (landlord.id) {
        const response = await agent.token.get(landlord.id);
        if (response?.access_token) {
          setConnected(true);
        }
      }
    } catch (error) {
      console.error("Error fetching integration status:", error);
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <PlugsConnectedIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Integrationen"
      />
      <CardContent>
        <Card sx={{ borderRadius: 1 }} variant="outlined">
          <Stack divider={<Divider />}>
            {integrations.map((integration) => (
              <Stack direction="row" key={integration.id} spacing={2} sx={{ alignItems: "center", px: 2, py: 1 }}>
                <Avatar
                  src={integration.icon}
                  sx={{
                    bgcolor: "var(--mui-palette-background-paper)",
                    boxShadow: "var(--mui-shadows-8)",
                    color: "var(--mui-palette-text-primary)",
                  }}
                >
                  {!integration.icon && <BankIcon fontSize="var(--Icon-fontSize)" />}{" "}
                </Avatar>
                <Box sx={{ flex: "1 1 auto" }}>
                  <Typography variant="subtitle2">{integration.name}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {integration.description}
                  </Typography>
                </Box>
                {connected ? (
                  <Button
                    color="secondary"
                    // endIcon={<PlusIcon />}
                    size="small"
                    variant="outlined"
                    // onClick={() => (window.location.href = tinkLink)} // Hier logic um den Token zu entfernen
                  >
                    Entfernen
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    endIcon={<PlusIcon />}
                    size="small"
                    variant="outlined"
                    onClick={() => (window.location.href = tinkLink)}
                  >
                    Verbinden
                  </Button>
                )}
              </Stack>
            ))}
          </Stack>
        </Card>
      </CardContent>
    </Card>
  );
}
