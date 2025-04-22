import { FC } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, Divider, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { paths } from "src/paths";
import { useRecoilValueLoadable } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";

interface OverviewRepairRequest {
  showActions: boolean;
}

export const OverviewRepairRequest: FC<OverviewRepairRequest> = (props) => {
  const { showActions } = props;
  const rentalObjectsLoadable = useRecoilValueLoadable(rentalObjectsAtom);

  let content;
  if (rentalObjectsLoadable.state === "loading") {
    content = (
      <Typography color="text.primary" variant="h4">
        <Skeleton />
      </Typography>
    );
  } else if (rentalObjectsLoadable.state === "hasValue") {
    const rentalObjects = rentalObjectsLoadable.contents;
    const totalRepairRequests =
      rentalObjects.length > 0
        ? rentalObjects.reduce((accumulator, rentalObject) => accumulator + rentalObject.repairRequests.length, 0)
        : 0;
    content = (
      <Typography color="text.primary" variant="h4">
        {totalRepairRequests}
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
          <img src="/assets/iconly/iconly-glass-info.svg" width={48} />
        </div>
        <Box>
          <Typography color="text.secondary" variant="body2">
            Reperatur Anfragen
          </Typography>
          {content}
        </Box>
      </Stack>
      <Divider />
      {showActions && (
        <CardActions>
          <Button
            color="inherit"
            href={paths.landlordportal.dashboard.objects.index}
            endIcon={
              <SvgIcon>
                <ArrowRightIcon />
              </SvgIcon>
            }
            size="small"
          >
            Objekte anzeigen
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
