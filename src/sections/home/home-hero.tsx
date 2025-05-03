"use client";

import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/components/router-link";
import { useUser } from "src/hooks/use-user";
import { paths } from "src/paths";

export function Hero(): React.JSX.Element {
  const { user } = useUser();
  return (
    <Box
      sx={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        // backgroundImage: 'url("/assets/gradient-bg.svg")',
        // color: "var(--mui-palette-common-white)",
        // backgroundColor: "#131217",
        overflow: "hidden",
        position: "relative",
        // pt: "120px",
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", py: "120px", zIndex: 3 }}>
        <Stack spacing={4}>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: "3.5rem", fontWeight: 600, lineHeight: 1.2, textAlign: "center" }}>
              Verwalte deine Immobilien{" "}
              <Typography color="primary.main" component="span" variant="inherit">
                mühelos
              </Typography>{" "}
              und{" "}
              <Typography color="primary.main" component="span" variant="inherit">
                effizient
              </Typography>{" "}
            </Typography>
            <Typography color="neutral.300" sx={{ fontWeight: 400, textAlign: "center" }} variant="h5">
              Unsere benutzerfreundliche Software macht es einfach, deine Immobilien effizient zu verwalten. Behalte den
              Überblick über Mietzahlungen, Mieter, Objekte und mehr – alles auf einen Blick
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
            <Button
              component={RouterLink}
              href={user ? paths.landlordportal.dashboard.index : paths.auth.firebase.login}
              variant="contained"
            >
              Jetzt ausprobieren
            </Button>
          </Stack>
        </Stack>
      </Container>
      <div id="gradient"></div>
      <div id="pattern"></div>
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 2, mt: { xs: "0px", sm: "100px", md: "100px", lg: "100px" } }}
      >
        <Box sx={{ bottom: 0, left: 0, position: "absolute", px: "24px", right: 0, top: 0, zIndex: 0 }}>
          <Box sx={{ bgcolor: "#f8f8fa", borderRadius: "28px", height: "110%", width: "100%" }} />
        </Box>
        <Box
          sx={{
            bgcolor: "var(--mui-palette-primary-main)",
            filter: "blur(50px)",
            height: "30px",
            left: "50%",
            position: "absolute",
            top: 0,
            transform: "translateX(-50%)",
            width: "80%",
            zIndex: 1,
          }}
        />
        <Box
          component="img"
          src={"/assets/home-hero-light.png"}
          sx={{
            display: "block",
            height: "auto",
            position: "relative",
            width: "100%",
            zIndex: 2,
          }}
        />
      </Container>
    </Box>
  );
}
