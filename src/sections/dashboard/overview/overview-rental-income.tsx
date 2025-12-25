import type { ApexOptions } from "apexcharts";
import { Box, Card, CardHeader, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
import { RentPayment } from "@prisma/client";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";
import { rentPaymentsAtom } from "src/state/atoms/rentPayments";
import { loadable } from "jotai/utils";
import { useAtom, useAtomValue } from "jotai";

type ChartSeries = {
  name: string;
  data: number[];
}[];

const useChartOptions = (months: string[]): ApexOptions => {
  const theme = useTheme();

  return {
    noData: { text: "Noch keine Mieteinnahmen erfasst" },
    chart: {
      background: "transparent",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.primary.light],
    dataLabels: {
      enabled: false,
    },
    legend: {
      labels: {
        colors: theme.palette.text.secondary,
      },
      onItemClick: {
        toggleDataSeries: false,
      },
      onItemHover: {
        highlightDataSeries: false,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "32px",
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      y: {
        formatter: (value: number): string => `${value} €`,
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: months,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

export function OverviewRentalIncome() {
  const [{ isLoading: objectsLoading, isError: objectsError, data: rentalObjectsData }] = useAtom(rentalObjectsAtom);
  const [{ isLoading: paymentsLoading, isError: paymentsError, data: rentPaymentsData }] = useAtom(rentPaymentsAtom);

  const isLoading = objectsLoading || paymentsLoading;
  const isError = objectsError || paymentsError;

  const rentPaymentsAtomLoadable = loadable(rentPaymentsAtom);
  const [rentPaymentsValue] = useAtom(rentPaymentsAtomLoadable);

  if (isLoading) {
    return (
      <Card>
        <CardHeader subheader="Basierend auf das aktuelle Jahr" title="Mieteinnahmen" />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 250 }}>
          <Skeleton variant="rounded" width="90%" height={225} />
        </Box>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader subheader="Basierend auf das aktuelle Jahr" title="Mieteinnahmen" />
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 250 }}>
          <Typography color="error" variant="body2">
            Fehler beim Laden der Daten.
          </Typography>
        </Box>
      </Card>
    );
  }

  const rentalObjects = rentalObjectsData ?? [];
  const rentPaymentsState = rentPaymentsData ?? [];

  const getAllRentPayments = () => {
    const allRentPayments: RentPayment[] = [];
    if (rentPaymentsState && rentPaymentsState.length > 0) {
      const filterNullPaymentDateRentPayments = rentPaymentsState.filter((rentPayment) => rentPayment.paymentDate !== null);
      const filterNotPaidPaymentRentPayments = filterNullPaymentDateRentPayments.filter((rentPayment) => rentPayment.status === "PAID");
      allRentPayments.push(...filterNotPaidPaymentRentPayments);
    }
    return allRentPayments;
  };

  const rentPayments = getAllRentPayments();

  const groupRentPaymentsByMonth = (rentPayments: RentPayment[]) => {
    const groupedRentPayments: any = {};

    for (const rentPayment of rentPayments) {
      const month = rentPayment.paymentDate && new Date(rentPayment.paymentDate).getMonth();
      const year = rentPayment.paymentDate && new Date(rentPayment.paymentDate).getFullYear();
      const monthKey = `${year}-${month}`;

      if (!groupedRentPayments[monthKey]) {
        groupedRentPayments[monthKey] = {
          month: month,
          year: year,
          totalPaymentAmount: 0,
        };
      }

      groupedRentPayments[monthKey].totalPaymentAmount += rentPayment.paymentAmount;
    }

    return Object.values(groupedRentPayments);
  };

  rentPayments.sort(
    (a, b) =>
      (a.paymentDate ? new Date(a.paymentDate).getTime() : new Date().getTime()) -
      (b.paymentDate ? new Date(b.paymentDate).getTime() : new Date().getTime())
  );

  const groupedRentPayments: any = groupRentPaymentsByMonth(rentPayments);
  const totalPaymentAmounts = groupedRentPayments.map((groupedRentPayment: any) => groupedRentPayment.totalPaymentAmount);
  const getMonthName = (monthNumber: number) => {
    const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    return monthNames[monthNumber];
  };
  const months = groupedRentPayments.map((groupedRentPayment: any) => getMonthName(groupedRentPayment.month));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chartOptions = useChartOptions(months);
  const updatedChartSeries: ChartSeries = [
    {
      name: "Diesen Monat",
      data: totalPaymentAmounts,
    },
  ];
  return (
    <Card>
      <CardHeader subheader="Basierend auf das aktuelle Jahr" title="Mieteinnahmen" />
      <Box>
        <Chart height={250} options={chartOptions} series={updatedChartSeries} type="bar" />
      </Box>
    </Card>
  );
}
