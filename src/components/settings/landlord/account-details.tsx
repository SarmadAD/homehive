"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { useUser } from "src/hooks/use-user";

export function AccountDetails(): React.JSX.Element {
  const { user } = useUser();
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <UserIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Basisinformationen"
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <FormControl disabled>
              <InputLabel>Full name</InputLabel>
              <OutlinedInput defaultValue={user?.name} name="fullName" />
            </FormControl>
            <FormControl disabled>
              <InputLabel>E-Mail-Adresse</InputLabel>
              <OutlinedInput name="email" type="email" value={user?.email} />
              {/* <FormHelperText>
                Please <Link variant="inherit">contact us</Link> to change your email
              </FormHelperText> */}
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
