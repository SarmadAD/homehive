import { FC, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { objectsApi } from "src/api/objects";
import { RepairRequest } from "src/types/repairRequest";
import { paths } from "src/paths";

interface OverviewRepairRequest {
  showActions: boolean;
}

export const OverviewRepairRequest: FC<OverviewRepairRequest> = (props) => {
  const { showActions } = props;
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>();

  async function getAllRepairRequests() {
    const localRepairRequests = await objectsApi.getAllRepairRequests();
    if (localRepairRequests.length > 0) {
      setRepairRequests(localRepairRequests);
    }
  }
  useEffect(() => {
    getAllRepairRequests();
  }, []);

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
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="text.secondary" variant="body2">
            Reperatur Anfragen
          </Typography>
          <Typography color="text.primary" variant="h4">
            {repairRequests?.length}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      {showActions && (
        <CardActions>
          <Button
            color="inherit"
            href={paths.dashboard.objects.index}
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

OverviewRepairRequest.propTypes = {};
