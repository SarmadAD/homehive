import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import { Avatar, Box, Button, Chip, Container, Divider, Link, Stack, SvgIcon, Tab, Tabs, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { customersApi } from "src/api/customers";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import { CustomerInvoices } from "src/sections/dashboard/customer/customer-invoices";
import { CustomerLogs } from "src/sections/dashboard/customer/customer-logs";
import { CustomerInvoice, CustomerLog } from "src/types/customer";
import type { Page as PageType } from "src/types/page";
import { getInitials } from "src/utils/get-initials";
import { RentalObject } from "src/types/object";
import { objectsApi } from "src/api/objects";
import { useRouter } from "next/router";
import { ObjectBasicDetails } from "src/sections/dashboard/objects/object-basic-details";
import { ObjectRentInfoChart } from "src/sections/dashboard/objects/object-rentInfo-chart";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Mieter", value: "renter" },
  { label: "Wartung/Reperatur", value: "repair" },
];

const useRentalObject = (): RentalObject | null => {
  const isMounted = useMounted();
  const router = useRouter();
  const [rentalObject, setRentalObject] = useState<RentalObject | null>(null);

  const handleRentalObjectGet = useCallback(async () => {
    try {
      const response = await objectsApi.getObject({ objectId: router.query.objectId?.toString() });

      if (isMounted()) {
        setRentalObject(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handleRentalObjectGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return rentalObject;
};

const useInvoices = (): CustomerInvoice[] => {
  const isMounted = useMounted();
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);

  const handleInvoicesGet = useCallback(async () => {
    try {
      const response = await customersApi.getInvoices();

      if (isMounted()) {
        setInvoices(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handleInvoicesGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return invoices;
};

const useLogs = (): CustomerLog[] => {
  const isMounted = useMounted();
  const [logs, setLogs] = useState<CustomerLog[]>([]);

  const handleLogsGet = useCallback(async () => {
    try {
      const response = await customersApi.getLogs();

      if (isMounted()) {
        setLogs(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handleLogsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return logs;
};

const Page: PageType = () => {
  const [currentTab, setCurrentTab] = useState<string>("details");
  const rentalObject = useRentalObject();

  const invoices = useInvoices();
  const logs = useLogs();

  usePageView();

  const handleTabsChange = useCallback((event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  }, []);

  if (!rentalObject) {
    return null;
  }

  return (
    <>
      <Seo title="Objekt Details" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack spacing={4}>
              <div>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.objects.index}
                  sx={{
                    alignItems: "center",
                    display: "inline-flex",
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">Objekte</Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Avatar
                    src={rentalObject.image}
                    sx={{
                      height: 64,
                      width: 64,
                    }}
                  >
                    {getInitials(rentalObject.name)}
                  </Avatar>
                  <Stack spacing={1}>
                    <Typography variant="h4">{rentalObject.name}</Typography>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="subtitle2">user_id:</Typography>
                      <Chip label={rentalObject.id} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    endIcon={
                      <SvgIcon>
                        <Edit02Icon />
                      </SvgIcon>
                    }
                    href={paths.dashboard.objects.edit}
                  >
                    Edit
                  </Button>
                  <Button
                    endIcon={
                      <SvgIcon>
                        <ChevronDownIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Actions
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 3 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === "details" && (
              <div>
                <Grid container spacing={4}>
                  <Grid xs={12} lg={4}>
                    <ObjectBasicDetails
                      id={rentalObject.id}
                      createdAt={rentalObject.createdAt}
                      address={rentalObject.address}
                      areaSize={rentalObject.areaSize}
                      city={rentalObject.city}
                      houseNr={rentalObject.houseNr}
                      postalCode={rentalObject.postalCode}
                      additionalHouseDetails={rentalObject.additionalHouseDetails}
                      image={rentalObject.image}
                      name={rentalObject.name}
                      rentInfo={rentalObject.rentInfo}
                      renter={rentalObject.renter}
                      status={rentalObject.status}
                    />
                  </Grid>
                  <Grid xs={12} lg={8}>
                    <ObjectRentInfoChart
                      id={rentalObject.rentInfo.id}
                      baseRent={rentalObject.rentInfo.baseRent}
                      electricityCosts={rentalObject.rentInfo.electricityCosts}
                      heatingCosts={rentalObject.rentInfo.heatingCosts}
                      waterCosts={rentalObject.rentInfo.waterCosts}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
            {currentTab === "invoices" && <CustomerInvoices invoices={invoices} />}
            {currentTab === "logs" && <CustomerLogs logs={logs} />}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
