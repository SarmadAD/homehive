import type { FC } from "react";
import { useState } from "react";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import { Box, Collapse, Container, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid } from "@mui/material";

interface FaqType {
  question: string;
  answer: string;
}

const faqs: FaqType[] = [
  // {
  //   question: "Kann ich HomeHive kostenlos testen?",
  //   answer:
  //     "Ja, du kannst monatlich kündigen und so die Plattform flexibel testen. Es gibt keinen kostenlosen Plan, aber die Einstiegskosten sind sehr gering.",
  // },
  {
    question: "Für wen ist HomeHive geeignet?",
    answer:
      "HomeHive richtet sich an private Vermieter und kleine Hausverwaltungen, die eine einfache und übersichtliche Lösung zur Mietverwaltung suchen.",
  },
  {
    question: "Was ist das Vermieter-Portal?",
    answer:
      "Im Vermieter-Portal kannst du deine Objekte verwalten, Mieter einladen, Mieteingänge einsehen und deine Einnahmen übersichtlich analysieren.",
  },
  {
    question: "Was ist das Mieter-Portal?",
    answer: "Im Mieter-Portal sehen Mieter das ihnen zugewiesene Objekt und erhalten Informationen wie den Mietbetrag.",
  },
  {
    question: "Wie funktioniert das Tracking der Mieteinnahmen?",
    answer:
      "HomeHive speichert keine Bankdaten, sondern prüft lediglich deine Kontobewegungen auf mögliche Mieteingänge. Anhand von Betrag und den Verwendungszweck werden passende Transaktionen erkannt und im Dashboard angzeigt",
  },
  {
    question: "Was passiert nach dem Kauf?",
    answer:
      "Nach dem Kauf bekommst du sofort Zugriff auf alle Funktionen. Dein Konto wird entsprechend deinem gewählten Plan aktiviert.",
  },
  {
    question: "Was beinhaltet der Einmal-Kauf?",
    answer: "Mit dem Einmal-Kauf erhältst du lebenslangen Zugriff auf HomeHive ohne weitere Kosten.",
  },
  {
    question: "Wie kann ich mein Abo kündigen?",
    answer:
      "Du kannst dein Abo jederzeit unter den Kontoeinstellungen kündigen. Nach der Kündigung endet dein Zugang automatisch zum Ende des Abrechnungszeitraums.",
  },
];

interface FaqProps {
  answer: string;
  question: string;
}

const Faq: FC<FaqProps> = (props) => {
  const { answer, question } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Stack onClick={() => setIsExpanded((prevState) => !prevState)} spacing={2} sx={{ cursor: "pointer" }}>
      <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2}>
        <Typography variant="subtitle1">{question}</Typography>
        <SvgIcon>{isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}</SvgIcon>
      </Stack>
      <Collapse in={isExpanded}>
        <Typography color="text.secondary" variant="body2">
          {answer}
        </Typography>
      </Collapse>
    </Stack>
  );
};

export const HomeFaqs: FC = (props) => {
  return (
    <Box sx={{ py: "120px" }} {...props}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="h3">Alles, was du wissen musst</Typography>
              <Typography color="text.secondary" variant="subtitle2">
                Häufig gestellte Fragen rund um HomeHive
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={12} md={6}>
            <Stack spacing={4}>
              {faqs.map((faq, index) => (
                <Faq key={index} {...faq} />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
