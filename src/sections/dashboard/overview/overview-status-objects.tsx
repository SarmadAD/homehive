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
  Link,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { Chart } from "src/components/chart";
import { ApexOptions } from "apexcharts";
import { paths } from "src/paths";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import { objectStatusSeriesData } from "src/state/selectors/objectStatusSeriesData";
import agent from "src/api/agent";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import OverViewStatusObjectsSkeleton from "src/skeleton/dashboard-skeletons";
import { RouterLink } from "src/components/router-link";

interface OverviewStatusObjects {
  showActions: boolean;
}

const labels: string[] = ["Bewohnt", "Unbewohnt"];
const mainColor = "var(--mui-palette-primary-main)";
const secondaryColor = "var(--mui-palette-text-primary)";

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
    colors: [mainColor, secondaryColor],
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
        colors: [mainColor, secondaryColor],
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
  const rentalObjectsLoadable = useRecoilValueLoadable(rentalObjectsAtom);
  const objectStatusData = useRecoilValueLoadable(objectStatusSeriesData);

  let content;
  if (rentalObjectsLoadable.state === "loading" || objectStatusData.state === "loading") {
    content = <OverViewStatusObjectsSkeleton />;
  } else if (rentalObjectsLoadable.state === "hasValue" && objectStatusData.state === "hasValue") {
    const rentalObjects = rentalObjectsLoadable.contents;
    const statusData = objectStatusData.contents;

    content =
      statusData[0] === 0 && statusData[1] === 0 ? (
        <Container maxWidth="sm">
          <CardContent sx={{ mt: 1 }}>
            <Typography color="text.secondary" variant="body2">
              <Link component={RouterLink} href={paths.landlordportal.dashboard.objects.index}>
                Lege Objekte an
              </Link>
              , um hier die Anzahl der bewohnten und unbewohnten Objekte zu sehen
            </Typography>
          </CardContent>
        </Container>
      ) : (
        <Container maxWidth="sm">
          <CardContent>
            <Chart height={500} width={300} options={chartOptions} series={statusData} type="donut" />
          </CardContent>
        </Container>
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
      >
        <Box sx={{ flexGrow: 1 }}>{content}</Box>
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
