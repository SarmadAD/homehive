"use client";

import { ChangeEvent, useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
  TextField,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";
import { getInitials } from "src/utils/get-initials";
import { Renter } from "src/types/renter";
import { renterApi } from "src/api/renter";
import { RenterBasicDetails } from "src/sections/dashboard/renter/renter-basic-details";
import { useSearchParams } from "next/navigation";

const tabs = [{ label: "Details", value: "details" }];

const useRenter = (): Renter | null => {
  const isMounted = useMounted();

  const searchParams = useSearchParams();
  const renterId = searchParams?.get("renterId");

  const [renter, setRenter] = useState<Renter | null>(null);

  const handleRenterGet = useCallback(async () => {
    try {
      const response = await renterApi.getRenter({ renterId: renterId?.toString() });

      if (isMounted()) {
        setRenter(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handleRenterGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return renter;
};

const useCurrentRenter = (renters?: Renter[], renterId?: string): Renter | undefined => {
  return useMemo((): Renter | undefined => {
    if (!renterId) {
      return undefined;
    }

    return renters?.find((renter) => renter.id === renterId);
  }, [renters, renterId]);
};

const Page: PageType = () => {
  const [currentTab, setCurrentTab] = useState<string>("details");
  const renter = useRenter();

  usePageView();

  const handleTabsChange = useCallback((event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  }, []);

  if (!renter) {
    return null;
  }

  return (
    <>
      <Seo title="Objekt Details" />
      <Box
        component="main"
        sx={{
          display: "flex",
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={4}>
              <Stack spacing={4}>
                <div>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.renters.index}
                    sx={{
                      alignItems: "center",
                      display: "inline-flex",
                    }}
                    underline="hover"
                  >
                    <SvgIcon sx={{ mr: 1 }}>
                      <ArrowLeftIcon />
                    </SvgIcon>
                    <Typography variant="subtitle2">Mieter</Typography>
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
                      src={renter.image}
                      sx={{
                        height: 64,
                        width: 64,
                      }}
                    >
                      {getInitials(renter.name)}
                    </Avatar>
                    <Stack spacing={1}>
                      <Typography variant="h4">{renter.name}</Typography>
                      <Stack alignItems="center" direction="row" spacing={1}>
                        <Typography variant="subtitle2">user_id:</Typography>
                        <Chip label={renter.id} size="small" />
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
                      <RenterBasicDetails email={renter.email} name={renter.name} status={renter.status} />
                    </Grid>
                  </Grid>
                </div>
              )}
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
