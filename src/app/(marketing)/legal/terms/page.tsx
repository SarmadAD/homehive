import { Card, CardContent, CardHeader, Container, Typography, List, ListItem } from "@mui/material";

export default function TermsPage() {
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
        <CardHeader title="Allgemeine Geschäftsbedingungen (AGB)" titleTypographyProps={{ textAlign: "center", variant: "h4" }} />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Diese Bedingungen regeln die Nutzung des SaaS-Dienstes "HomeHive" unter homehive.me.
          </Typography>

          <List sx={{ listStyleType: "decimal", pl: 2 }}>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Geltungsbereich:</strong> Diese AGB gelten für alle Nutzer von HomeHive mit Wohnsitz in Deutschland. Abweichende Bedingungen
                gelten nur, wenn sie schriftlich bestätigt wurden.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Leistung:</strong> Online-Software zur Verwaltung von Mieteinnahmen und Objekten. Die Nutzung erfolgt webbasiert.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Vertragsschluss:</strong> Der Vertrag kommt durch Registrierung und Auswahl eines Plans zustande
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Zahlung:</strong> Abrechnung erfolgt über Stripe – monatlich, jährlich oder einmalig
              </Typography>
            </ListItem>{" "}
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong> Vertragslaufzeit und Verlängerung:</strong> Monatliche und jährliche Abonnements verlängern sich automatisch um die jeweils
                gewählte Laufzeit, sofern sie nicht rechtzeitig gekündigt werden.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Kündigung:</strong> Monatliche und jährliche Pläne können jederzeit vor Ablauf gekündigt werden. Einmalzahlungen sind nicht
                stornierbar. Bei Kündigung erfolgt keine anteilige Rückerstattung.
              </Typography>
            </ListItem>{" "}
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Pflichten der Nutzer:</strong> Nutzer sind verpflichtet, wahrheitsgemäße Angaben zu machen und Zugangsdaten vertraulich zu
                behandeln. Eine Weitergabe von Accounts ist untersagt.
              </Typography>
            </ListItem>{" "}
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Verfügbarkeit</strong> HomeHive bemüht sich um eine möglichst unterbrechungsfreie Bereitstellung. Es besteht kein Anspruch auf
                eine bestimmte Verfügbarkeit.
              </Typography>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Haftung:</strong> Beschränkt auf Vorsatz und grobe Fahrlässigkeit
              </Typography>
            </ListItem>{" "}
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Gerichtsstand und anwendbares Recht:</strong> Es gilt deutsches Recht. Gerichtsstand ist der Wohnsitz des Anbieters, soweit
                gesetzlich zulässig.
              </Typography>
            </ListItem>{" "}
            <ListItem sx={{ display: "list-item" }}>
              <Typography variant="body1">
                <strong>Schlussbestimmungen:</strong> Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen
                Regelungen unberührt.
              </Typography>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
