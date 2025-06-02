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
import LoadingButton from "@mui/lab/LoadingButton";
import { Bank as BankIcon } from "@phosphor-icons/react/dist/ssr/Bank";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { useState } from "react";
import agent from "src/api/agent";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { toast } from "src/components/toaster";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";

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
  const landlord = useRecoilValue(currentLandlordAtom);
  const refreshLandlord = useRecoilRefresher_UNSTABLE(currentLandlordAtom);
  const [isLoading, setIsLoading] = useState(false);
  // const tinkLink =
  //   process.env.NODE_ENV === "production"
  //     ? `https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.NEXT_PUBLIC_TINK_CLIENT_ID}&redirect_uri=https%3A%2F%2Fhomehive.me%2Flandlordportal%2Fdashboard%2Fsettings%2Fintegrations&market=DE&locale=de_DE`
  //     : `https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.NEXT_PUBLIC_TINK_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flandlordportal%2Fdashboard%2Fsettings%2Fintegrations&market=DE&locale=de_DE`;

  const activeTokens = "hasAccess" in landlord ? landlord.tokens.filter((token) => token.state === 1) : [];

  async function handlePlaidConnect() {
    try {
      setIsLoading(true);
      // Hole das Link-Token über agent
      const data = await agent.integrations.plaid.linktoken.create(landlord.id);
      if (!data.link_token) throw new Error("Kein Link-Token erhalten");

      // Initialisiere Plaid Link
      const handler = (window as any).Plaid.create({
        token: data.link_token,
        onSuccess: async (public_token: string, metadata: any) => {
          await agent.integrations.plaid.accessToken.create(landlord.id, public_token);
          toast.success("Verbindung erfolgreich hergestellt");
          refreshLandlord();
          setIsLoading(false);
        },
        onExit: () => setIsLoading(false),
        onEvent: () => {},
      });
      handler.open();
    } catch (error) {
      setIsLoading(false);
      toast.error("Fehler bei der Verbindung");
      console.error(error);
    }
  }

  async function deactivateBankConnection() {
    try {
      setIsLoading(true);
      if (landlord.id) {
        const response: any = await agent.integrations.plaid.accessToken.deactivate(landlord.id);
        if (response.isDeactivated) {
          refreshLandlord();
          toast.success("Bankverbindung erfolgreich gelöscht");
        }
      }
    } catch (error) {
      console.log("Error deactivating connection", error);
    } finally {
      setIsLoading(false);
    }
  }
  // ONE TIME ACCESS TINK
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const query = new URLSearchParams(window.location.search);
  //       const code = query.get("code");
  //       if (code && landlord.id) {
  //         const tokenInfo: OneTimeAccessToken = { code, grant_type: "authorization_code" };
  //         const newToken = await agent.integrations.tink.token.generate(landlord.id, tokenInfo);

  //         setLandlord((prevLandlord) => ({
  //           ...prevLandlord,
  //           tokens: [...(("hasAccess" in prevLandlord && prevLandlord.tokens) || []), newToken],
  //         }));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchData();
  // }, [landlord.id]);
  //
  // const query = new URLSearchParams(window.location.search);
  // const codeInURI = query.get("code");

  // CONINUES ACCESS TINK
  // async function handleCreateRentPaymentIntegration() {
  //   try {
  //     setIsLoading(true);
  //     if (landlord.id) {
  //       const tokenInfo: TokenWithGrantTypeAndScope = { grant_type: "client_credentials", scope: "user:create" };
  //       const token = await agent.integrations.tink.token.generate(landlord.id, tokenInfo);
  //       if (token) {
  //         const user = await agent.integrations.tink.user.create(landlord.id);
  //         if (user) {
  //           const tokenInfo: TokenWithGrantTypeAndScope = { grant_type: "client_credentials", scope: "authorization:grant" };
  //           const token = await agent.integrations.tink.token.generate(landlord.id, tokenInfo);
  //           if (token) {
  //             const code = await agent.integrations.tink.user.grantAccess.grant(landlord.id);
  //             if (code) {
  //               const tinkLinkForContinuousAccess =
  //                 process.env.NODE_ENV === "production"
  //                   ? `https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.NEXT_PUBLIC_TINK_CLIENT_ID}&state=&redirect_uri=https%3A%2F%2Fhomehive.me%2Flandlordportal%2Fdashboard%2Fsettings%2Fintegrations&authorization_code=${code}&market=DE&locale=de_DE`
  //                   : `https://link.tink.com/1.0/transactions/connect-accounts/?client_id=${process.env.NEXT_PUBLIC_TINK_CLIENT_ID}&state=&redirect_uri=http://localhost:3000/landlordportal/dashboard/settings/integrations&authorization_code=${code}&market=DE&locale=de_DE`;
  //               window.location.href = tinkLinkForContinuousAccess;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   if (codeInURI && landlord.id) {
  //     const fetchUserAccessToken = async () => {
  //       try {
  //         const userAccessToken = await agent.integrations.tink.token.generateUserAccessToken(landlord.id);
  //         if (userAccessToken) {
  //           setLandlord((prevLandlord) => ({
  //             ...prevLandlord,
  //             tokens: [...(("hasAccess" in prevLandlord && prevLandlord.tokens) || []), userAccessToken],
  //           }));
  //           toast.success("Verbindung erfolgreich hergestellt"); //WENN DAS mit continues klappt, dann auf jeden fall abädnern das die tokens gelöscht weden. Also richtig gelöscht werden
  //         }
  //       } catch (error) {
  //         console.log("Error fetching user access token", error);
  //       }
  //     };
  //     fetchUserAccessToken();
  //   }
  // }, [codeInURI, landlord.id]);

  // async function removeTokens() {
  //   try {
  //     setIsLoading(true);
  //     if (landlord.id) {
  //       await deleteTinkUser();
  //       await agent.token.delete(landlord.id);
  //       setLandlord((prevLandlord) => ({
  //         ...prevLandlord,
  //         tokens: "hasAccess" in prevLandlord ? prevLandlord.tokens.map((token) => ({ ...token, state: 0 })) : [],
  //       }));
  //     }
  //   } catch (error) {
  //     console.log("Error removing tokens", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // async function deleteTinkUser() {
  //   try {
  //     if (landlord) {
  //       const userAccessToken = await agent.integrations.tink.token.generateUserAccessToken(landlord.id);
  //       if (userAccessToken) {
  //         await agent.integrations.tink.user.delete(landlord.id);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
                {activeTokens.length > 0 ? (
                  <LoadingButton loading={isLoading} variant="outlined" color="secondary" size="small" onClick={() => deactivateBankConnection()}>
                    Entfernen
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loading={isLoading}
                    variant="outlined"
                    color="secondary"
                    endIcon={<PlusIcon />}
                    size="small"
                    // onClick={() => handleCreateRentPaymentIntegration()}
                    onClick={handlePlaidConnect}
                  >
                    Verbinden
                  </LoadingButton>
                )}
              </Stack>
            ))}
          </Stack>
        </Card>
      </CardContent>
    </Card>
  );
}
