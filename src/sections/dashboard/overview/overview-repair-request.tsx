import { FC } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, Divider, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { paths } from "src/paths";
import { RouterLink } from "src/components/router-link";
import { useAtom } from "jotai";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";

interface OverviewRepairRequest {
  showActions: boolean;
}

export const OverviewRepairRequest: FC<OverviewRepairRequest> = (props) => {
  const { showActions } = props;
  const [{ data: rentalObject, isLoading: rentalObjectLoading }] = useAtom(rentalObjectAtom);

  let content;
  if (rentalObjectLoading) {
    content = (
      <Typography color="text.primary" variant="h4">
        <Skeleton />
      </Typography>
    );
  } else if (rentalObject && rentalObject.repairRequests) {
    const totalRepairRequests = rentalObject?.repairRequests.length > 0 ? rentalObject.repairRequests.length : 0;
    content = (
      <Typography color="text.primary" variant="h4">
        {totalRepairRequests}
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
            component={RouterLink}
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
