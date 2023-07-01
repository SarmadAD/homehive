"use client";

import { ChangeEvent, useMemo, useRef } from "react";
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
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";
import { getInitials } from "src/utils/get-initials";
import { RenterListTable } from "src/sections/dashboard/renter/renter-list-table";
import { useRentersSearch } from "src/hooks/use-renter-search";
import { useRentersIds } from "src/hooks/use-renters-ids";
import { useSelection } from "src/hooks/use-selection";
import { useDialog } from "src/hooks/use-dialog";
import { ObjectSingleView } from "src/app/dashboard/objects/renter/object-single-view";
import { useRepairRequestsSearch } from "src/hooks/use-repairRequestsSearch";
import { RenterDrawer } from "src/app/dashboard/objects/renter/object-renter-drawer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { useSearchParams } from "next/navigation";
import { ObjectBasicDetails } from "../object-basic-details";
import { ObjectRentInfoChart } from "../object-rentInfo-chart";
import { ObjectRepairRequestDrawer } from "../repairRequests/object-repairRequest-drawer";
import { ObjectRepairRequestList } from "../repairRequests/objects-repairRequests-list";
import { useRepairRequestsIds } from "src/hooks/use-repairRequestsIds";
import { Renter } from "@prisma/client";
import { RepairRequest } from "prisma/types/repairRequest";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Mieter", value: "renter" },
  { label: "Wartung/Reperatur", value: "repairRequests" },
];

const useCurrentRenter = (renters?: Renter[], renterId?: string): Renter | undefined => {
  return useMemo((): Renter | undefined => {
    if (!renterId) {
      return undefined;
    }

    return renters?.find((renter) => renter.id === renterId);
  }, [renters, renterId]);
};

const useCurrentRepairRequest = (repairRequests?: RepairRequest[], repairRequestId?: string): RepairRequest | undefined => {
  return useMemo((): RepairRequest | undefined => {
    if (!repairRequestId) {
      return undefined;
    }

    return repairRequests?.find((repairRequest) => repairRequest.id === repairRequestId);
  }, [repairRequests, repairRequestId]);
};

const Page: PageType = () => {
  const [currentTab, setCurrentTab] = useState<string>("details");
  const searchParams = useSearchParams();
  const objectId = searchParams.get("objectId");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dialog = useDialog<string>();

  const rentalObject = useRecoilValue(rentalObjectAtom);
  const setSelectedRentalObjectId = useSetRecoilState(selectedRentalObjectIdAtom);

  const rentersSearch = useRentersSearch();
  const repairRequestsSearch = useRepairRequestsSearch();

  const rentersIds = useRentersIds(rentalObject?.renter);
  const rentersSelection = useSelection<string>(rentersIds);

  const repairRequestsIds = useRepairRequestsIds(rentalObject?.repairRequests);
  const repairRequestsSelection = useSelection<string>(repairRequestsIds);

  const currentRenter = useCurrentRenter(rentalObject?.renter, dialog.data);
  const currentRepairRequest = useCurrentRepairRequest(rentalObject?.repairRequests, dialog.data);

  usePageView();

  async function setRentalObjectId() {
    if (objectId) {
      setSelectedRentalObjectId(objectId.toString() ?? "");
    }
  }

  useEffect(
    () => {
      setRentalObjectId();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDialog = useCallback(
    (id: string): void => {
      // Close drawer if is the same order

      if (dialog.open && dialog.data === id) {
        dialog.handleClose();
        return;
      }

      dialog.handleOpen(id);
    },
    [dialog]
  );

  const handleTabsChange = useCallback((event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
    dialog.handleClose();
  }, []);

  const handleAcceptRepairRequest = () => {};
  const handleRejectRepairRequest = () => {};

  if (!rentalObject) {
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
        ref={rootRef}
        sx={{
          display: "flex",
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <ObjectSingleView open={dialog.open}>
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
                        href={`${paths.dashboard.objects.edit}${rentalObject.id}`}
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
                {currentTab === "details" && rentalObject && (
                  <div>
                    <Grid container spacing={4}>
                      <Grid xs={12} lg={4}>
                        <ObjectBasicDetails />
                      </Grid>
                      <Grid xs={12} lg={8}>
                        <ObjectRentInfoChart />
                      </Grid>
                    </Grid>
                  </div>
                )}
                {currentTab === "renter" && (
                  <RenterListTable
                    count={rentalObject.renter.length}
                    items={rentalObject.renter}
                    onDeselectAll={rentersSelection.handleDeselectAll}
                    onDeselectOne={rentersSelection.handleDeselectOne}
                    onPageChange={rentersSearch.handlePageChange}
                    onRowsPerPageChange={rentersSearch.handleRowsPerPageChange}
                    onSelectAll={rentersSelection.handleSelectAll}
                    onSelectOne={rentersSelection.handleSelectOne}
                    page={rentersSearch.state.page}
                    rowsPerPage={rentersSearch.state.rowsPerPage}
                    selected={rentersSelection.selected}
                    onSelect={handleDialog}
                  />
                )}
                {currentTab === "repairRequests" && (
                  <ObjectRepairRequestList
                    count={rentalObject.repairRequests?.length}
                    items={rentalObject.repairRequests}
                    onDeselectAll={repairRequestsSelection.handleDeselectAll}
                    onDeselectOne={repairRequestsSelection.handleDeselectOne}
                    onPageChange={repairRequestsSearch.handlePageChange}
                    onRowsPerPageChange={repairRequestsSearch.handleRowsPerPageChange}
                    onSelectAll={repairRequestsSelection.handleSelectAll}
                    onSelectOne={repairRequestsSelection.handleSelectOne}
                    page={repairRequestsSearch.state.page}
                    rowsPerPage={repairRequestsSearch.state.rowsPerPage}
                    selected={repairRequestsSelection.selected}
                    onSelect={handleDialog}
                  />
                )}
              </Stack>
            </Container>
          </ObjectSingleView>
          {currentTab === "repairRequests" ? (
            <ObjectRepairRequestDrawer
              container={rootRef.current}
              onClose={dialog.handleClose}
              open={dialog.open}
              repairRequest={currentRepairRequest}
              handleAcceptRepairRequest={handleAcceptRepairRequest}
              handleRejectRepairRequest={handleRejectRepairRequest}
            />
          ) : (
            <RenterDrawer container={rootRef.current} onClose={dialog.handleClose} open={dialog.open} renter={currentRenter} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Page;
