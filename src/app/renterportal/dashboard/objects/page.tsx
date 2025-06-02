"use client";

import { ChangeEvent, useMemo, useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { Avatar, Box, Container, Divider, Stack, Tab, Tabs, Typography, Unstable_Grid2 as Grid, Skeleton } from "@mui/material";
import { Seo } from "src/components/seo";
import { getInitials } from "src/utils/get-initials";
import { useDialog } from "src/hooks/use-dialog";
import { ObjectSingleView } from "src/app/landlordportal/dashboard/objects/renter/object-single-view";
import { RepairRequest } from "prisma/types/repairRequest";
import agent from "src/api/agent";
import { ObjectBasicDetails } from "src/app/landlordportal/dashboard/objects/object-basic-details";
import { ObjectRepairRequestDrawer } from "src/app/landlordportal/dashboard/objects/repairRequests/object-repairRequest-drawer";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { RenterDrawer } from "src/app/landlordportal/dashboard/objects/renter/object-renter-drawer";
import { toast } from "src/components/toaster";
import { renterAtom } from "src/state/atoms/renterAtom";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { ObjectRentalAgreementChart } from "./object-rental-agreement-chart";

const tabs = [
  { label: "Details", value: "details" },
  // { label: "Wartung/Reperatur", value: "repairRequests" },
];

const useCurrentRepairRequest = (repairRequests?: RepairRequest[], repairRequestId?: string): RepairRequest | undefined => {
  return useMemo((): RepairRequest | undefined => {
    if (!repairRequestId) {
      return undefined;
    }

    return repairRequests?.find((repairRequest) => repairRequest.id === repairRequestId);
  }, [repairRequests, repairRequestId]);
};

export default function Page(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>("details");

  const hasShownToast = useRef(false);

  const renterLoadable = useRecoilValueLoadable(renterAtom);
  const renter = renterLoadable.contents;
  const isRenterLoading = renterLoadable.state === "loading";

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dialog = useDialog<string>();

  const rentalObjectLoadable = useRecoilValueLoadable(rentalObjectAtom);
  const rentalObject = rentalObjectLoadable.contents;
  const isRentalObjectLoading = rentalObjectLoadable.state === "loading";
  const setSelectedRentalObjectId = useSetRecoilState(selectedRentalObjectIdAtom);

  // const setRenter = useSetRecoilState(renterAtom);

  // const repairRequestsSearch = useRepairRequestsSearch();
  // const repairRequestsIds = useRepairRequestsIds(renter.rentalObject?.repairRequests);
  // const repairRequestsSelection = useSelection<string>(repairRequestsIds);

  const currentRepairRequest = useCurrentRepairRequest(renter.rentalObject?.repairRequests as RepairRequest[], dialog.data);

  const isLoading = isRenterLoading || isRentalObjectLoading;

  useEffect(() => {
    if (renter.rentalObjectId) {
      setSelectedRentalObjectId(renter.rentalObjectId ?? "");
    } else if (!isLoading) {
      toast.info("Ihnen wurde noch kein Objekt zugewiesen. Bitte wenden Sie sich an Ihren Vermieter.", {
        duration: 8000,
        closeButton: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renter]);

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

  if (!isLoading && rentalObject.id === "" && renter.id !== "") {
    // if (!hasShownToast.current) {
    //   toast.info("Ihnen wurde noch kein Objekt zugewiesen. Bitte wenden Sie sich an Ihren Vermieter.", {
    //     duration: 8000,
    //     closeButton: true,
    //   });
    //   hasShownToast.current = true;
    // }
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
                      {rentalObject?.image || rentalObject?.name ? (
                        <Avatar
                          src={rentalObject.image}
                          sx={{
                            height: 64,
                            width: 64,
                          }}
                        >
                          {getInitials(rentalObject.name)}
                        </Avatar>
                      ) : (
                        <Skeleton variant="circular" width={64} height={64} />
                      )}
                      <Stack spacing={1}>
                        {rentalObject?.name ? <Typography variant="h4">{rentalObject.name}</Typography> : <Skeleton width={150} height={32} />}
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
                        <ObjectRentalAgreementChart />
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
}
