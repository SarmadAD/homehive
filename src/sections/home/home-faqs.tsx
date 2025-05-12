import type { FC } from "react";
import { useState } from "react";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import {
  Box,
  Collapse,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
  Chip,
} from "@mui/material";
import { Question as QuestionIcon } from "@phosphor-icons/react/dist/ssr/Question";
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";

const faqs = [
  // {
  //   question: "Kann ich HomeHive kostenlos testen?",
  //   answer:
  //     "Ja, du kannst monatlich kündigen und so die Plattform flexibel testen. Es gibt keinen kostenlosen Plan, aber die Einstiegskosten sind sehr gering.",
  // },
  {
    id: "faq-1",
    question: "Für wen ist HomeHive geeignet?",
    answer:
      "HomeHive richtet sich an private Vermieter und kleine Hausverwaltungen, die eine einfache und übersichtliche Lösung zur Mietverwaltung suchen.",
  },
  {
    id: "faq-2",
    question: "Was ist das Vermieter-Portal?",
    answer:
      "Im Vermieter-Portal kannst du deine Objekte verwalten, Mieter einladen, Mieteingänge einsehen und deine Einnahmen übersichtlich analysieren.",
  },
  {
    id: "faq-3",
    question: "Was ist das Mieter-Portal?",
    answer: "Im Mieter-Portal sehen Mieter das ihnen zugewiesene Objekt und erhalten Informationen wie den Mietbetrag.",
  },
  {
    id: "faq-4",
    question: "Wie funktioniert das Tracking der Mieteinnahmen?",
    answer:
      "HomeHive speichert keine Bankdaten, sondern prüft lediglich deine Kontobewegungen auf mögliche Mieteingänge. Anhand von Betrag und den Verwendungszweck werden passende Transaktionen erkannt und im Dashboard angzeigt",
  },
  {
    id: "faq-5",
    question: "Was passiert nach dem Kauf?",
    answer:
      "Nach dem Kauf bekommst du sofort Zugriff auf alle Funktionen. Dein Konto wird entsprechend deinem gewählten Plan aktiviert.",
  },
  {
    id: "faq-6",
    question: "Was beinhaltet der Einmal-Kauf?",
    answer: "Mit dem Einmal-Kauf erhältst du lebenslangen Zugriff auf HomeHive ohne weitere Kosten.",
  },
  {
    id: "faq-7",
    question: "Wie kann ich mein Abo kündigen?",
    answer:
      "Du kannst dein Abo jederzeit unter den Kontoeinstellungen kündigen. Nach der Kündigung endet dein Zugang automatisch zum Ende des Abrechnungszeitraums.",
  },
] satisfies { id: string; question: string; answer: string }[];

export function Faqs(): React.JSX.Element {
  return (
    <Box sx={{ bgcolor: "var(--mui-palette-background-level1)", py: "120px" }}>
      <Container maxWidth="md">
        <Stack spacing={8}>
          <Stack maxWidth="700px" sx={{ mx: "auto" }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Chip color="primary" icon={<QuestionIcon />} label="FAQ" variant="soft" />
              </Box>
              <Typography sx={{ textAlign: "center" }} variant="h3">
                Häufig gestellte Fragen rund um HomeHive
              </Typography>
              <Typography color="text.secondary">
                Du hast eine weitere Frage, die hier nicht beantwortet wird? Kontaktiere uns über{" "}
                <Box
                  component="a"
                  href="mailto:info@homehive.me"
                  sx={{ color: "inherit", textDecoration: "underline" }}
                >
                  email
                </Box>
                .
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={2}>
            {faqs.map((faq) => (
              <Faq key={faq.id} {...faq} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export interface FaqProps {
  answer: string;
  question: string;
}

function Faq({ answer, question }: FaqProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        onClick={() => {
          setIsExpanded((prevState) => !prevState);
        }}
        sx={{ cursor: "pointer" }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1">{question}</Typography>
          {isExpanded ? <CaretDownIcon /> : <CaretRightIcon />}
        </Stack>
        <Collapse in={isExpanded}>
          <Typography color="text.secondary" sx={{ pt: 3 }} variant="body2">
            {answer}
          </Typography>
        </Collapse>
      </Stack>
    </Card>
  );
}
