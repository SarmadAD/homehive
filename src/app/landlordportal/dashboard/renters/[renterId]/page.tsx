"use client";

import { ChangeEvent } from "react";
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
  CircularProgress,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";
import { getInitials } from "src/utils/get-initials";
import { RenterBasicDetails } from "src/sections/dashboard/renter/renter-basic-details";
import { useSearchParams } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedRenterIdAtom } from "src/state/atoms/selectedRenterIdAtom";
import { renterAtom } from "src/state/atoms/renterAtom";
import { getRenterName } from "src/utils/get-renter-name";

const tabs = [{ label: "Details", value: "details" }];

const Page: PageType = () => {
  const [currentTab, setCurrentTab] = useState<string>("details");

  const renter = useRecoilValue(renterAtom);
  usePageView();

  const setSelectedRenterIdAtom = useSetRecoilState(selectedRenterIdAtom);

  const searchParams = useSearchParams();
  const renterId = searchParams?.get("renterId");

  async function setRenterId() {
    if (renterId) {
      setSelectedRenterIdAtom(renterId.toString() ?? "");
    }
  }

  useEffect(
    () => {
      setRenterId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleTabsChange = useCallback((event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  }, []);

  if (!renter) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
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
                    href={paths.landlordportal.dashboard.renters.index}
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
                      {getInitials(getRenterName(renter.firstname, renter.surname))}
                    </Avatar>
                    <Stack spacing={1}>
                      <Typography variant="h4">{getRenterName(renter.firstname, renter.surname)}</Typography>
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
                      href={paths.landlordportal.dashboard.objects.edit}
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
                      <RenterBasicDetails renter={renter} />
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
