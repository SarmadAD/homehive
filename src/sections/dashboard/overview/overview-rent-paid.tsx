import { FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, Divider, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { paths } from "src/paths";
import { totalPaidRentsAtom } from "src/state/atoms/totalPaidRentsAtom";
import { RouterLink } from "src/components/router-link";
import { dayjs } from "src/lib/dayjs";
import { loadable } from "jotai/utils";
import { useAtom } from "jotai";

dayjs.locale("de");

interface OverviewRentPaidProps {
  showActions: boolean;
}

export const OverviewRentPaid: FC<OverviewRentPaidProps> = (props) => {
  const { showActions } = props;
  const lengthPaidRentsLoadable = loadable(totalPaidRentsAtom);
  const [value] = useAtom(lengthPaidRentsLoadable);

  let content;
  if (value.state === "loading") {
    content = (
      <Typography color="text.primary" variant="h4">
        <Skeleton />
      </Typography>
    );
  } else if (value.state === "hasData") {
    const lengthPaidRents = value.data;
    content = (
      <Typography color="text.primary" variant="h4">
        {lengthPaidRents !== undefined ? lengthPaidRents : "Keine Daten verfügbar"}
      </Typography>
    );
  } else {
    content = (
      <Typography color="error" variant="body2">
        Fehler beim Laden der Daten.
      </Typography>
    );
  }

  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3,
        }}
      >
        <div>
          <img src="/assets/iconly/iconly-glass-tick.svg" width={48} />
        </div>
        <Box>
          <Typography color="text.secondary" variant="body2">
            Mieten bezahlt im {dayjs().format("MMMM")}
          </Typography>
          {content}
        </Box>
      </Stack>

      {showActions ? (
        <>
          <Divider />
          <CardActions>
            <Button
              component={RouterLink}
              color="inherit"
              endIcon={
                <SvgIcon>
                  <ArrowRightIcon />
                </SvgIcon>
              }
              size="small"
              href={paths.landlordportal.dashboard.finances.index}
            >
              Mieten anzeigen
            </Button>
          </CardActions>
        </>
      ) : (
        ""
      )}
    </Card>
  );
};
