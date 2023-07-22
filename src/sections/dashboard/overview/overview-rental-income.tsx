import type { FC } from "react";
import PropTypes from "prop-types";
import type { ApexOptions } from "apexcharts";
import { Box, Card, CardHeader, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
import { RentPayment } from "@prisma/client";

type ChartSeries = {
  name: string;
  data: number[];
}[];

const useChartOptions = (months: string[]): ApexOptions => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.mode === "dark" ? theme.palette.primary.darkest : theme.palette.primary.light,
    ],
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

interface OverviewRentalIncome {
  chartSeries: ChartSeries;
}

interface GroupedRentPayments {
  paymentDate: Date;
  paymentAmount: number;
}

export const OverviewRentalIncome: FC<OverviewRentalIncome> = (props) => {
  const groupRentPaymentsByMonth = (rentPayments: GroupedRentPayments[]) => {
    const groupedRentPayments: any = {};

    for (const rentPayment of rentPayments) {
      const month = rentPayment.paymentDate.getMonth();
      const year = rentPayment.paymentDate.getFullYear();
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
  const rentPayments: GroupedRentPayments[] = [
    { paymentDate: new Date("2023-07-01"), paymentAmount: 40 },
    { paymentDate: new Date("2023-07-03"), paymentAmount: 40 },
    { paymentDate: new Date("2023-01-06"), paymentAmount: 40 },
    { paymentDate: new Date("2023-07-06"), paymentAmount: 40 },
    { paymentDate: new Date("2023-02-06"), paymentAmount: 40 },
    { paymentDate: new Date("2023-07-15"), paymentAmount: 37 },
    { paymentDate: new Date("2023-08-01"), paymentAmount: 41 },
    { paymentDate: new Date("2023-12-12"), paymentAmount: 41 },
    { paymentDate: new Date("2023-12-12"), paymentAmount: 101 },
    { paymentDate: new Date("2023-03-12"), paymentAmount: 101 },
    { paymentDate: new Date("2023-11-12"), paymentAmount: 101 },
  ];

  rentPayments.sort((a, b) => a.paymentDate.getTime() - b.paymentDate.getTime());
  const groupedRentPayments: any = groupRentPaymentsByMonth(rentPayments);
  const totalPaymentAmounts = groupedRentPayments.map(
    (groupedRentPayment: any) => groupedRentPayment.totalPaymentAmount
  );
  const getMonthName = (monthNumber: number) => {
    const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    return monthNames[monthNumber];
  };
  const months = groupedRentPayments.map((groupedRentPayment: any) => getMonthName(groupedRentPayment.month));
  const chartOptions = useChartOptions(months);
  const updatedChartSeries: ChartSeries = [
    {
      name: "Diesen Monat",
      data: totalPaymentAmounts,
    },
  ];
  return (
    <Card>
      <CardHeader
        subheader="Basierend auf dem ausgewählten Zeitraum"
        title="Mieteinnahmen"
        action={
          <Tabs value="year">
            <Tab label="Year" value="year" />
            <Tab label="Month" value="month" />
            <Tab label="Week" value="week" />
          </Tabs>
        }
      />
      <Box sx={{ height: 336 }}>
        <Chart height={300} options={chartOptions} series={updatedChartSeries} type="bar" />
      </Box>
    </Card>
  );
};

OverviewRentalIncome.propTypes = {
  chartSeries: PropTypes.array.isRequired,
};
