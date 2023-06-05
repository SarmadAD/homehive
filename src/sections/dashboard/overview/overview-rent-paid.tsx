import { FC, useEffect } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, Divider, Stack, SvgIcon, Typography } from "@mui/material";
import { renterApi } from "src/api/renter";
import { paths } from "src/paths";
import { useRecoilState, useRecoilValue } from "recoil";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { totalPaidRents } from "src/state/selectors/TotalPaidRents";

interface OverviewRentPaidProps {
  showActions: boolean;
}

export const OverviewRentPaid: FC<OverviewRentPaidProps> = (props) => {
  const { showActions } = props;
  const [renters, setRenters] = useRecoilState(rentersAtom);
  const lengthPaidRents = useRecoilValue(totalPaidRents);

  async function getAllRenters() {
    const renters = await renterApi.getAllRenter();
    if (renters.length > 0) {
      setRenters(renters);
    }
  }
  useEffect(() => {
    getAllRenters();
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
          <img src="/assets/iconly/iconly-glass-tick.svg" width={48} />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="text.secondary" variant="body2">
            Mieten bezahlt
          </Typography>
          <Typography color="text.primary" variant="h4">
            {lengthPaidRents} / {renters.length}
          </Typography>
        </Box>
      </Stack>

      {showActions ? (
        <>
          <Divider />
          <CardActions>
            <Button
              color="inherit"
              endIcon={
                <SvgIcon>
                  <ArrowRightIcon />
                </SvgIcon>
              }
              size="small"
              href={paths.dashboard.renters.index}
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

OverviewRentPaid.propTypes = {
  showActions: PropTypes.bool,
};
