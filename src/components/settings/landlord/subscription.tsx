"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import { Money as Money } from "@phosphor-icons/react/dist/ssr/Money";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { useUser } from "src/hooks/use-user";
import { Button, SvgIcon } from "@mui/material";

export function Subscription(): React.JSX.Element {
  const { user } = useUser();
  const customerPortalLink = "https://billing.stripe.com/p/login/test_8x28wP0wjdfl2TybmK5gc00";
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <Money fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Aboverwalten"
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <FormControl>
              {" "}
              <Button
                endIcon={
                  <SvgIcon>
                    <ArrowRightIcon />
                  </SvgIcon>
                }
                size="small"
                variant="text"
                href={customerPortalLink + `?prefilled_email=${user?.email}`}
                sx={{ width: "auto", alignSelf: "flex-start" }}
              >
                Verwalten{" "}
              </Button>
            </FormControl>
          </Stack>
        </Stack>
      </CardContent>
      {/* <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button color="secondary">Cancel</Button>
        <Button variant="contained">Save changes</Button>
      </CardActions> */}
    </Card>
  );
}
