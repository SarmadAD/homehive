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
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { paths } from "src/paths";
import type { Page as PageType } from "src/types/page";
import { getInitials } from "src/utils/get-initials";
import { useSelection } from "src/hooks/use-selection";
import { useDialog } from "src/hooks/use-dialog";
import { ObjectSingleView } from "src/app/landlordportal/dashboard/objects/renter/object-single-view";
import { useRepairRequestsSearch } from "src/hooks/use-repairRequestsSearch";
import { useRepairRequestsIds } from "src/hooks/use-repairRequestsIds";
import { RepairRequest } from "prisma/types/repairRequest";
import { renterDefault } from "prisma/types/renter";
import agent from "src/api/agent";
import { SplashScreen } from "src/components/splash-screen";
import { useAuth } from "src/hooks/use-auth";
import { AuthContextType } from "src/contexts/auth/firebase";
import { ObjectBasicDetails } from "src/app/landlordportal/dashboard/objects/object-basic-details";
import { ObjectRentInfoChart } from "src/app/landlordportal/dashboard/objects/object-rentInfo-chart";
import { ObjectRepairRequestList } from "src/app/landlordportal/dashboard/objects/repairRequests/objects-repairRequests-list";
import { ObjectRepairRequestDrawer } from "src/app/landlordportal/dashboard/objects/repairRequests/object-repairRequest-drawer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { RenterDrawer } from "src/app/landlordportal/dashboard/objects/renter/object-renter-drawer";
import { toast } from "src/components/toaster";
import { currentUserAtom } from "src/state/atoms/currentUserAtom";
import { renterAtom } from "src/state/atoms/renterAtom";
import { selectedRenterIdAtom } from "src/state/atoms/selectedRenterIdAtom";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Wartung/Reperatur", value: "repairRequests" },
];

const useCurrentRepairRequest = (
  repairRequests?: RepairRequest[],
  repairRequestId?: string
): RepairRequest | undefined => {
  return useMemo((): RepairRequest | undefined => {
    if (!repairRequestId) {
      return undefined;
    }

    return repairRequests?.find((repairRequest) => repairRequest.id === repairRequestId);
  }, [repairRequests, repairRequestId]);
};

const Page: PageType = () => {
  const [currentTab, setCurrentTab] = useState<string>("details");
  const [isLoading, setIsLoading] = useState(false);

  const hasShownToast = useRef(false);
  const renter = useRecoilValue(renterAtom);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dialog = useDialog<string>();

  const rentalObject = useRecoilValue(rentalObjectAtom);
  const setSelectedRenterIdAtom = useSetRecoilState(selectedRenterIdAtom);
  const setSelectedRentalObjectId = useSetRecoilState(selectedRentalObjectIdAtom);

  const setRenter = useSetRecoilState(currentUserAtom);

  // const repairRequestsSearch = useRepairRequestsSearch();
  // const repairRequestsIds = useRepairRequestsIds(renter.rentalObject?.repairRequests);
  // const repairRequestsSelection = useSelection<string>(repairRequestsIds);

  const currentRepairRequest = useCurrentRepairRequest(
    renter.rentalObject?.repairRequests as RepairRequest[],
    dialog.data
  );

  const { user } = useAuth<AuthContextType>();

  usePageView();

  useEffect(() => {
    getRenter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   setRentalObjectId();
  // }, [renter]);

  async function getRenter() {
    try {
      const firebaseUserId = user?.id;
      if (firebaseUserId) {
        setIsLoading(true);
        const renter = await agent.renter.details(firebaseUserId);
        setRenter(renter);
        setSelectedRenterIdAtom(renter.id);
        setSelectedRentalObjectId(renter.rentalObjectId ?? "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // const handleDialog = useCallback(
  //   (id: string): void => {
  //     // Close drawer if is the same order

  //     if (dialog.open && dialog.data === id) {
  //       dialog.handleClose();
  //       return;
  //     }

  //     dialog.handleOpen(id);
  //   },
  //   [dialog]
  // );

  const handleTabsChange = useCallback((event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
    dialog.handleClose();
  }, []);

  async function updateRepairRequest(repairRequest: RepairRequest) {
    try {
      if (repairRequest) {
        await agent.objects.updateRepairRequest(repairRequest);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleAcceptRepairRequest = async () => {
    if (currentRepairRequest) {
      let newRepairRequest = { ...currentRepairRequest };
      newRepairRequest.status = "INPROGRESS";
      await updateRepairRequest(newRepairRequest);
    }
  };

  const handleRejectRepairRequest = async () => {
    if (currentRepairRequest) {
      let newRepairRequest = { ...currentRepairRequest };
      newRepairRequest.status = "REJECTED";
      await updateRepairRequest(newRepairRequest);
    }
  };
  const handleDoneRepairRequest = async () => {
    if (currentRepairRequest) {
      let newRepairRequest = { ...currentRepairRequest };
      newRepairRequest.status = "DONE";
      await updateRepairRequest(newRepairRequest);
    }
  };

  const handleCanceledRepairRequest = async () => {
    if (currentRepairRequest) {
      let newRepairRequest = { ...currentRepairRequest };
      newRepairRequest.status = "CANCELED";
      await updateRepairRequest(newRepairRequest);
    }
  };

  if (isLoading || (!renter.id && !rentalObject.id)) {
    return <SplashScreen />;
  }

  // Wenn rentalObjekt immer noch default ist, dann zeige den Toast an
  if (!rentalObject.id && !isLoading) {
    if (!hasShownToast.current) {
      toast.info("Ihnen wurde noch kein Objekt zugewiesen. Bitte wenden Sie sich an Ihren Vermieter.", {
        duration: 8000,
        closeButton: true,
      });
      hasShownToast.current = true;
    }
    return <></>;
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
                        {/* <Stack alignItems="center" direction="row" spacing={1}>
                          <Typography variant="subtitle2">user_id:</Typography>
                          <Chip label={rentalObject.id} size="small" />
                        </Stack> */}
                      </Stack>
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
                {/* {currentTab === "repairRequests" && (
                  // <ObjectRepairRequestList
                  //   count={rentalObject.repairRequests?.length}
                  //   items={rentalObject.repairRequests as RepairRequest[]}
                  //   onDeselectAll={repairRequestsSelection.handleDeselectAll}
                  //   onDeselectOne={repairRequestsSelection.handleDeselectOne}
                  //   onPageChange={repairRequestsSearch.handlePageChange}
                  //   onRowsPerPageChange={repairRequestsSearch.handleRowsPerPageChange}
                  //   onSelectAll={repairRequestsSelection.handleSelectAll}
                  //   onSelectOne={repairRequestsSelection.handleSelectOne}
                  //   page={repairRequestsSearch.state.page}
                  //   rowsPerPage={repairRequestsSearch.state.rowsPerPage}
                  //   selected={repairRequestsSelection.selected}
                  //   onSelect={handleDialog}
                  // />
                )} */}
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
              handleDoneRepairRequest={handleDoneRepairRequest}
              handleCanceledRepairRequest={handleCanceledRepairRequest}
            />
          ) : (
            /**RenterDrawer here not used but needs to be added because it changes the design. I not know why but it is working :D */
            <RenterDrawer container={rootRef.current} onClose={dialog.handleClose} open={dialog.open} renter={renter} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Page;
