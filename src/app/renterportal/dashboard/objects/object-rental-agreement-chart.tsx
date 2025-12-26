import type { FC } from "react";
import type { ApexOptions } from "apexcharts";
import numeral from "numeral";
import { Box, Card, CardContent, CardHeader, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
import { renterAtom } from "src/state/atoms/renterAtom";
import { useAtom } from "jotai";

const labels: string[] = ["Kaltmiete", "Nebenkosten"];

type ChartSeries = number[];
const useChartOptions = (): ApexOptions => {
  const theme = useTheme();
  const mainColor = "var(--mui-palette-primary-main)";

  return {
    chart: {
      background: "transparent",
    },
    colors: [mainColor, "rgba(247,144,9,1)", "rgba(49,46,129,1)", "rgba(6,174,212,1)"],
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
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

export const ObjectRentalAgreementChart: FC = () => {
  const chartOptions = useChartOptions();
  const [{ data: renter, isLoading: renterLoading, isError: renterError }] = useAtom(renterAtom);

  if (renterLoading) {
    return (
      <Box>
        <Card>
          <CardHeader title="Miete" subheader="Monatlichen Miete" />
          <CardContent>
            <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={3}>
              <Skeleton variant="circular" width={200} height={200} />
              <Stack spacing={4} sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    Deine monatliche Miete
                  </Typography>
                  <Skeleton width={100} height={32} />
                </Stack>
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    Mietkostenaufteilung
                  </Typography>
                  <Stack
                    component="ul"
                    spacing={1}
                    sx={{
                      listStyle: "none",
                      m: 0,
                      p: 0,
                    }}
                  >
                    {labels.map((label, index) => (
                      <Stack alignItems="center" component="li" direction="row" key={index} spacing={2}>
                        <Skeleton variant="rectangular" width={16} height={16} />
                        <Skeleton width={100} height={24} />
                        <Skeleton width={50} height={24} />
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (renterError) {
    return (
      <Box>
        <Card>
          <CardHeader title="Mieteinnahmen" subheader="Mieteinnahmen des Objekts" />
          <CardContent>
            <Typography color="error" variant="body2">
              Fehler beim Laden der Daten.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const agreement = renter?.rentalAgreement;

  // Safely access agreement properties, fallback to 0 if agreement is null or undefined
  const chartSeries: ChartSeries = [agreement?.baseRent ?? 0, agreement?.serviceCharges ?? 0];
  const totalAmount = chartSeries.reduce((acc, item) => (acc += item), 0);
  const formattedTotalAmount = numeral(totalAmount).format("$0,0.00");

  return (
    <Box>
      <Card>
        <CardHeader title="Miete" subheader="Monatlichen Miete" />
        <CardContent>
          <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={3}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                height: 200,
                justifyContent: "center",
                width: 200,
              }}
            >
              <Chart height={200} options={chartOptions} series={chartSeries} type="donut" />
            </Box>
            <Stack spacing={4} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Deine monatliche Miete
                </Typography>
                <Typography variant="h4">{formattedTotalAmount}</Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  Mietkostenaufteilung
                </Typography>
                <Stack
                  component="ul"
                  spacing={1}
                  sx={{
                    listStyle: "none",
                    m: 0,
                    p: 0,
                  }}
                >
                  {chartSeries.map((item, index) => {
                    const amount = numeral(item).format("$0,0.00");

                    return (
                      <Stack alignItems="center" component="li" direction="row" key={index} spacing={2}>
                        <Box
                          sx={{
                            backgroundColor: chartOptions.colors![index],
                            borderRadius: "4px",
                            height: 16,
                            width: 16,
                          }}
                        />
                        <Typography sx={{ flexGrow: 1 }} variant="subtitle2">
                          {labels[index]}
                        </Typography>
                        <Typography color="text.secondary" variant="subtitle2">
                          {amount}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
      </Card>
    </Box>
  );
};
