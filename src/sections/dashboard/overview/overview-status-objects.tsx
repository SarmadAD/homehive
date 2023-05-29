import type { FC } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, SvgIcon, useTheme } from "@mui/material";
import { Chart } from "src/components/chart";
import { ApexOptions } from "apexcharts";

interface OverviewStatusObjects {
  amount: number;
}
type ChartSeries = number[];
const chartSeries: ChartSeries = [25, 75];
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
export const OverviewStatusObjects: FC<OverviewStatusObjects> = (props) => {
  const chartOptions = useChartOptions();

  return (
    <Card>
      <Stack
        alignItems="center"
        direction={{
          xs: "column",
          sm: "row",
        }}
      >
        <Box>
          <Container maxWidth="sm">
            <CardContent>
              <Chart height={500} width={300} options={chartOptions} series={chartSeries} type="donut" />
            </CardContent>
          </Container>
        </Box>
      </Stack>
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
        >
          Objete ansehen
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewStatusObjects.propTypes = {
  amount: PropTypes.number.isRequired,
};
