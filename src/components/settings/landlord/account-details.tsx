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
          {/* <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                border: "1px dashed var(--mui-palette-divider)",
                borderRadius: "50%",
                display: "inline-flex",
                p: "4px",
              }}
            >
              <Box sx={{ borderRadius: "inherit", position: "relative" }}>
                <Box
                  sx={{
                    alignItems: "center",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "inherit",
                    bottom: 0,
                    color: "var(--mui-palette-common-white)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    right: 0,
                    top: 0,
                    zIndex: 1,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <CameraIcon fontSize="var(--icon-fontSize-md)" />
                    <Typography color="inherit" variant="subtitle2">
                      Select
                    </Typography>
                  </Stack>
                </Box>
                <Avatar src="/assets/avatar.png" sx={{ "--Avatar-size": "100px" }} />
              </Box>
            </Box>
            <Button color="secondary" size="small">
              Remove
            </Button>
          </Stack> */}
          <Stack spacing={2}>
            <FormControl disabled>
              <InputLabel>Full name</InputLabel>
              <OutlinedInput defaultValue={user?.name} name="fullName" />
            </FormControl>
            <FormControl disabled>
              <InputLabel>Email address</InputLabel>
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
