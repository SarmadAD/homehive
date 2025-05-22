import { Card, CardContent, CardHeader, Container, Typography } from "@mui/material";

export default function Page() {
  return (
    <Container maxWidth="lg" sx={{ py: "120px" }}>
      <Card
        sx={{
          maxWidth: 800,
          mx: "auto",
          borderRadius: "16px",
          boxShadow: 3,
        }}
      >
        <CardHeader
          title="Impressum"
          titleTypographyProps={{ textAlign: "center", variant: "h4" }}
          subheaderTypographyProps={{ textAlign: "center", color: "text.secondary" }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Kontakt
          </Typography>
          <Typography variant="body2">
            Sarmad Ahmad
            <br />
            handelnd als HomeHive
            <br />
            Kreuzkamp 86
            <br />
            48683 Ahaus
            <br />
            Deutschland
          </Typography>

          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
            Kontaktinformationen
          </Typography>
          <Typography variant="body2">E-Mail: info@homehive.me</Typography>

          <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
            Verantwortlich für den Inhalt
          </Typography>
          <Typography variant="body2">Sarmad Ahmad</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
