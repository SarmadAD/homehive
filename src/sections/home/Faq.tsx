"use client";

import { Box, Collapse, Container, Stack, SvgIcon, Typography, Card, Chip } from "@mui/material";
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { useState } from "react";

export interface FaqProps {
  answer: string;
  question: string;
}

export default function Faq({ answer, question }: FaqProps): React.JSX.Element {
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
