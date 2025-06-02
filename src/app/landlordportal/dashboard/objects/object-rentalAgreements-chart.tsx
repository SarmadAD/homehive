import type { FC } from "react";
import type { ApexOptions } from "apexcharts";
import numeral from "numeral";
import { Box, Card, CardContent, CardHeader, Divider, Link, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
import { useRecoilValueLoadable } from "recoil";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";

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
  const rentalObjectLoadable = useRecoilValueLoadable(rentalObjectAtom);

  if (rentalObjectLoadable.state === "loading" || (rentalObjectLoadable.state === "hasValue" && rentalObjectLoadable.contents.id === "")) {
    return (
      <Box>
        <Card>
          <CardHeader title="Mieteinnahmen" subheader="Mieteinnahmen des Objekts" />
          <CardContent>
            <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={3}>
              <Skeleton variant="circular" width={200} height={200} />
              <Stack spacing={4} sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    {"∅ Gesamtmiete"}
                  </Typography>
                  <Skeleton width={100} height={32} />
                </Stack>
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    {"∅ Einnahmen pro Vertrag"}
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

  if (rentalObjectLoadable.state === "hasError") {
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

  const rentalObject = rentalObjectLoadable.contents;
  const agreements = rentalObject.rentalAgreement ?? [];

  // Durchschnittswerte berechnen
  const avg = (arr: number[]) => (arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length);

  const baseRents = agreements.map((a: any) => a.baseRent).filter((v: number | null | undefined) => typeof v === "number" && v !== null);

  const serviceCharges = agreements.map((a: any) => a.serviceCharges).filter((v: number | null | undefined) => typeof v === "number" && v !== null);

  const avgBaseRent = avg(baseRents);
  const avgServiceCharges = avg(serviceCharges);

  const chartSeries: ChartSeries = [avgBaseRent, avgServiceCharges];
  const totalAmount = chartSeries.reduce((acc, item) => acc + item, 0);
  const formattedTotalAmount = numeral(totalAmount).format("$0,0.00");

  if (agreements.length === 0 || (avgBaseRent === 0 && avgServiceCharges === 0)) {
    return (
      <Box>
        <Card>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              borderTopLeftRadius: 1,
              borderTopRightRadius: 1,
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary" variant="body2">
              Es sind noch keine Mietverhältnissen vorhanden.
              <Link component={RouterLink} href={paths.landlordportal.dashboard.rentalagreements.index} underline="none" sx={{ ml: 1 }}>
                Mietverhältnissen anlegen
              </Link>
            </Typography>
          </Box>
          <CardHeader title="Mieteinnahmen" subheader="Durchschnittliche Mieteinnahmen des Objekts" />
          <CardContent>
            <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={3}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  height: 200,
                  justifyContent: "center",
                  width: 200,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "50%",
                }}
              ></Box>
              <Stack spacing={4} sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    {"∅ Gesamtmiete"}
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    –
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    {"∅ Einnahmen"}
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
                        <Box
                          sx={{
                            backgroundColor: chartOptions.colors![index],
                            borderRadius: "4px",
                            height: 16,
                            width: 16,
                          }}
                        />
                        <Typography sx={{ flexGrow: 1 }} variant="subtitle2" color="text.secondary">
                          {label}
                        </Typography>
                        <Typography color="text.secondary" variant="subtitle2">
                          –
                        </Typography>
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

  return (
    <Box>
      <Card>
        <CardHeader title="Mieteinnahmen" subheader="Durchschnittliche Mieteinnahmen des Objekts" />
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
                  {"∅ Gesamtmiete"}
                </Typography>
                <Typography variant="h4">{formattedTotalAmount}</Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="overline">
                  {"∅ Einnahmen"}
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
