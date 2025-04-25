import { FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, Divider, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { paths } from "src/paths";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { totalPaidRents } from "src/state/selectors/totalPaidRents";
import { RouterLink } from "src/components/router-link";

interface OverviewRentPaidProps {
  showActions: boolean;
}

export const OverviewRentPaid: FC<OverviewRentPaidProps> = (props) => {
  const { showActions } = props;
  const lengthPaidRentsLoadable = useRecoilValueLoadable(totalPaidRents);

  let content;
  if (lengthPaidRentsLoadable.state === "loading") {
    content = (
      <Typography color="text.primary" variant="h4">
        <Skeleton />
      </Typography>
    );
  } else if (lengthPaidRentsLoadable.state === "hasValue") {
    const lengthPaidRents = lengthPaidRentsLoadable.contents;
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
            Mieten bezahlt
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
              href={paths.landlordportal.dashboard.renters.index}
            >
              Mieter anzeigen
            </Button>
          </CardActions>
        </>
      ) : (
        ""
      )}
    </Card>
  );
};
