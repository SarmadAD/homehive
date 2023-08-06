import PropTypes from "prop-types";
import type { ApexOptions } from "apexcharts";
import { Box, Card, CardHeader, Tab, Tabs } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
import { RentPayment } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { rentalObjectsAtom } from "src/state/atoms/rentalObjectsAtom";

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

export function OverviewRentalIncome() {
  const rentalObjects = useRecoilValue(rentalObjectsAtom);

  const getAllRentPayments = () => {
    const allRentPayments: RentPayment[] = [];
    rentalObjects.forEach((rentalObject) => {
      if (rentalObject.rentPayment && rentalObject.rentPayment.length > 0) {
        const filterNullPaymentDateRentPayments = rentalObject.rentPayment.filter(
          (rentPayment) => rentPayment.paymentDate !== null
        );
        const filterNotPaidPaymentRentPayments = filterNullPaymentDateRentPayments.filter(
          (rentPayment) => rentPayment.status === "PAID"
        );
        allRentPayments.push(...filterNotPaidPaymentRentPayments);
      }
    });
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
        subheader="Basierend auf das aktuelle Jahr"
        title="Mieteinnahmen"
        // action={
        //   <Tabs value="year">
        //     <Tab label="Year" value="year" />
        //     <Tab label="Month" value="month" />
        //     <Tab label="Week" value="week" />
        //   </Tabs>
        // }
      />
      <Box sx={{ height: 250 }}>
        <Chart height={250} options={chartOptions} series={updatedChartSeries} type="bar" />
      </Box>
    </Card>
  );
}
