"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export function Hero(): React.JSX.Element {
  return (
    <Box
      sx={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundImage: 'url("/assets/gradient-bg.svg")',
        pt: "120px",
      }}
    >
      <Container maxWidth="lg">
        <Box maxWidth="sm">
          <Typography sx={{ fontSize: "3.5rem", fontWeight: 600, lineHeight: 1.2 }}>
            Verwalte deine Immobilien{" "}
            <Typography color="primary.main" component="span" variant="inherit">
              mühelos
            </Typography>{" "}
            und{" "}
            <Typography color="primary.main" component="span" variant="inherit">
              effizient
            </Typography>{" "}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            Unsere benutzerfreundliche Software macht es einfach, deine Immobilien effizient zu verwalten. Behalte den
            Überblick über Mietzahlungen, Reparaturen und mehr – alles auf einen Blick
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
