import { Card, CardContent, CardHeader, Container, Typography, Box } from "@mui/material";

export default function CancellationPage() {
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
        <CardHeader title="Widerrufsbelehrung" titleTypographyProps={{ textAlign: "center", variant: "h4" }} />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Verbraucher haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
          </Typography>

          <Typography variant="body1" sx={{ mt: 4 }} gutterBottom>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns informieren:
          </Typography>
          <Typography variant="body1" gutterBottom>
            Sarmad Ahmad
            <br />
            handelnd als HomeHive
            <br />
            Kreuzkamp 86
            <br />
            48683 Ahaus
            <br />
            Deutschland
            <br />
            E-Mail: info@homehive.me
          </Typography>

          <Typography variant="body1" sx={{ mt: 4 }} gutterBottom>
            mittels einer eindeutigen Erklärung (z. B. per E-Mail).
          </Typography>

          <Typography variant="h6" sx={{ mt: 6 }} gutterBottom>
            Erlöschen des Widerrufsrechts:
          </Typography>
          <Typography variant="body1" gutterBottom>
            Das Widerrufsrecht erlischt, wenn Sie zustimmen, dass wir mit der Ausführung der digitalen Dienstleistung vor Ablauf der Widerrufsfrist
            beginnen und Sie bestätigen, dass Sie mit Beginn der Ausführung Ihr Widerrufsrecht verlieren.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
