import { FC, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, SvgIcon, useTheme } from "@mui/material";
import { Chart } from "src/components/chart";
import { ApexOptions } from "apexcharts";
import { paths } from "src/paths";
import { objectsApi } from "src/api/objects";
import { RentalObject } from "src/types/object";
import { useRecoilState, useRecoilValue } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import { objectStatusSeriesData } from "src/state/selectors/objectStatusSeriesData";

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
export const OverviewStatusObjects: FC<OverviewStatusObjects> = (props) => {
  const chartOptions = useChartOptions();
  const { showActions } = props;
  const [allRentalObjects, setAllRentalObjects] = useRecoilState(rentalObjectsAtom);
  const objectStatusData = useRecoilValue(objectStatusSeriesData);

  async function getAllObjects() {
    const localAllObjects = await objectsApi.getAllObjects();
    if (localAllObjects.length > 0) {
      setAllRentalObjects(localAllObjects);
    }
  }
  useEffect(() => {
    getAllObjects();
  }, []);

  if (allRentalObjects === undefined) {
    return undefined;
  }

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
              <Chart height={500} width={300} options={chartOptions} series={objectStatusData} type="donut" />
            </CardContent>
          </Container>
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
