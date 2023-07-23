import { FC, useEffect } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { Chart } from "src/components/chart";
import { ApexOptions } from "apexcharts";
import { paths } from "src/paths";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import { objectStatusSeriesData } from "src/state/selectors/objectStatusSeriesData";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth/firebase";
import agent from "src/api/agent";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";

interface OverviewStatusObjects {
  showActions: boolean;
}

const labels: string[] = ["Bewohnt", "Unbewohnt"];

const useChartOptions = (): ApexOptions => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.primary.light,
      theme.palette.warning.light,
      theme.palette.success.light,
      theme.palette.info.light,
      theme.palette.neutral[700],
    ],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    labels,
    legend: {
      labels: {
        colors: theme.palette.text.secondary,
      },
      show: true,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
};
export const OverviewStatusObjects = ({ showActions }: OverviewStatusObjects) => {
  const chartOptions = useChartOptions();
  const [allRentalObjects, setAllRentalObjects] = useRecoilState(rentalObjectsAtom);
  const objectStatusData = useRecoilValue(objectStatusSeriesData);

  if (allRentalObjects === undefined) {
    return <></>;
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
      >
        <Box sx={{ flexGrow: 1 }}>
          {objectStatusData[0] === 0 && objectStatusData[1] === 0 ? (
            <Container maxWidth="sm">
              <CardContent>
                <Typography color="text.primary" variant="body2">
                  Legen Sie Objekte an, um hier die Anzahl der bewohnten und unbewohnten Objekte zusehen
                </Typography>{" "}
              </CardContent>
            </Container>
          ) : (
            <Container maxWidth="sm">
              <CardContent>
                <Chart height={500} width={300} options={chartOptions} series={objectStatusData} type="donut" />
              </CardContent>
            </Container>
          )}
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
            Objete ansehen
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

OverviewStatusObjects.propTypes = {
  showActions: PropTypes.bool.isRequired,
};
