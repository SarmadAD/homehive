import { FC } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, Divider, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { paths } from "src/paths";
import { totalPaidRentsAtom } from "src/state/atoms/totalPaidRentsAtom";
import { RouterLink } from "src/components/router-link";
import { dayjs } from "src/lib/dayjs";
import { useAtom } from "jotai";

dayjs.locale("de");

interface OverviewRentPaidProps {
  showActions: boolean;
}

export const OverviewRentPaid: FC<OverviewRentPaidProps> = (props) => {
  const { showActions } = props;
  const [{ value, isLoading }] = useAtom(totalPaidRentsAtom);

  let content;
  if (isLoading) {
    content = (
      <Typography color="text.primary" variant="h4">
        <Skeleton width={30} height={50} />
      </Typography>
    );
  } else if (value !== undefined) {
    content = (
      <Typography color="text.primary" variant="h4">
        {value !== undefined ? value : "Keine Daten verfügbar"}
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
