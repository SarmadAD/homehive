import { Card, CardContent, CardHeader, Container, Typography, Link, List, ListItem } from "@mui/material";

export default function PrivacyPage() {
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
        <CardHeader title="Datenschutzerklärung" titleTypographyProps={{ textAlign: "center", variant: "h4" }} />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            <strong>Verantwortlicher:</strong>
            <br />
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
            Wir verarbeiten Ihre Daten gemäß Art. 6 Abs. 1 lit. b DSGVO zur Vertragserfüllung und Leistungserbringung.
          </Typography>

          <Typography variant="body1" sx={{ mt: 4 }} gutterBottom>
            Wir nutzen folgende Dienste:
          </Typography>
          <List>
            <ListItem>
              <Typography variant="body1">
                <strong>Stripe</strong> – zur Zahlungsabwicklung. Weitere Informationen in der{" "}
                <Link href="https://stripe.com/de/privacy" target="_blank" rel="noopener">
                  Stripe Datenschutzerklärung
                </Link>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>Tink</strong> – zur Bankkontointegration. Weitere Informationen in der{" "}
                <Link
                  href="https://assets.ctfassets.net/c78bhj3obgck/5hsHRQ5CA8v3pakiSW7TCn/5107c9cc68ffdf5e670c2aa07f4bf875/General_Privacy_Notice_08-04-2025.pdf"
                  target="_blank"
                  rel="noopener"
                >
                  Tink Datenschutzerklärung
                </Link>
              </Typography>
            </ListItem>{" "}
            <ListItem>
              <Typography variant="body1">
                <strong>Supabase</strong> – zur Verwaltung von Benutzerdaten (z. B. E-Mail, Login). Weitere Informationen in der{" "}
                <Link href="https://supabase.com/privacy" target="_blank" rel="noopener">
                  Supabase Datenschutzerklärung
                </Link>
                .
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="body1">
                <strong>Vercel</strong> – für das Hosting dieser Website. Weitere Informationen in der{" "}
                <Link href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">
                  Vercel Datenschutzerklärung
                </Link>
                .
              </Typography>
            </ListItem>
          </List>

          <Typography variant="body1" sx={{ mt: 4 }}>
            Sie haben das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten. Kontaktieren Sie uns dazu unter der oben genannten
            E-Mail-Adresse.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
