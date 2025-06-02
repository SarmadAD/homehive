"use client";

import { ChangeEvent, MouseEvent, useMemo, useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Skeleton,
  Card,
} from "@mui/material";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { getInitials } from "src/utils/get-initials";
import { useRentersSearch } from "src/hooks/use-renter-search";
import { useSelection } from "src/hooks/use-selection";
import { useDialog } from "src/hooks/use-dialog";
import { ObjectSingleView } from "src/app/landlordportal/dashboard/objects/renter/object-single-view";
import { useRepairRequestsSearch } from "src/hooks/use-repairRequestsSearch";
import { RenterDrawer } from "src/app/landlordportal/dashboard/objects/renter/object-renter-drawer";
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { selectedRentalObjectIdAtom } from "src/state/atoms/selectedRentalObjectIdAtom";
import { rentalObjectAtom } from "src/state/atoms/rentalObjectAtom";
import { useSearchParams } from "next/navigation";
import { ObjectBasicDetails } from "../object-basic-details";
import { ObjectRepairRequestDrawer } from "../repairRequests/object-repairRequest-drawer";
import { useRepairRequestsIds } from "src/hooks/use-repairRequestsIds";
import { RepairRequest } from "prisma/types/repairRequest";
import { Renter } from "prisma/types/renter";
import agent from "src/api/agent";
import { DeleteOutline } from "@mui/icons-material";
import { useRouter } from "src/hooks/use-router";
import { DeleteModal } from "src/components/widgets/modals/delete-modal";
import { AddRenterModal } from "src/components/widgets/modals/add-renter-modal";
import { rentersAtom } from "src/state/atoms/rentersAtom";
import { RentalObject } from "prisma/types/objects";
import { toast } from "src/components/toaster";
import React from "react";
import { ColumnDef, DataTable } from "src/components/data-table";
import DotsVertical from "@untitled-ui/icons-react/build/esm/DotsVertical";
import { PlusCircle, User03 } from "@untitled-ui/icons-react";
import { GeneralPagination } from "src/components/common/pagination/general-pagination";
import { useGeneralPagination } from "src/hooks/use-general-pagination";
import { currentLandlordAtom } from "src/state/atoms/currentLandlordAtom";
import { ObjectRentalAgreementChart } from "../object-rentalAgreements-chart";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Mieter", value: "renter" },
  // { label: "Wartung/Reperatur", value: "repairRequests" },
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

export default function Page(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>("details");
  const searchParams = useSearchParams();
  const objectId = searchParams.get("objectId");
  const router = useRouter();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dialog = useDialog<string>();

  const setSelectedRentalObjectId = useSetRecoilState(selectedRentalObjectIdAtom);
  const setRentalObject = useSetRecoilState(rentalObjectAtom);
  const rentalObject = useRecoilValue(rentalObjectAtom);

  const rentersSearch = useRentersSearch();
  const repairRequestsSearch = useRepairRequestsSearch();

  // const rentersIds = useRentersIds(rentalObject?.renter);
  const rentersIds = React.useMemo(() => rentalObject?.renter.map((renter) => renter.id), [rentalObject]);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useSelection(rentersIds);

  const renters = useRecoilValue(rentersAtom);

  const landlordLoadable = useRecoilValueLoadable(currentLandlordAtom);
  const landloadLoading = landlordLoadable.state === "loading";

  const repairRequestsIds = useRepairRequestsIds(rentalObject?.repairRequests);
  // const repairRequestsSelection = useSelection<string>(repairRequestsIds);

  const currentRenter = useCurrentRenter(rentalObject?.renter as Renter[], dialog.data);
  const currentRepairRequest = useCurrentRepairRequest(rentalObject?.repairRequests as RepairRequest[], dialog.data);

  const [openDeleteModalForRenter, setOpenDeleteModalForRenter] = useState(false);
  const [openDeleteModalForRentalObject, setOpenDeleteModalForRentalObject] = useState(false);
  // const [openAddRenterModal, setOpenAddRenterModal] = useState(false);

  // Renter Menu Three Dots Menu
  // const [anchorElRenterThreeDotsMenu, setAnchorElRenterThreeDotsMenu] = React.useState<null | HTMLElement>(null);

  // const openRenterThreeDotsMenu = Boolean(anchorElRenterThreeDotsMenu);
  // const handleClickRenterThreeDotsMenu = (event: React.MouseEvent<HTMLButtonElement>, row: Renter) => {
  //   selectOne(row.id);
  //   setAnchorElRenterThreeDotsMenu(event.currentTarget);
  // };

  // Action Menu
  const [anchorElActionMenu, setAnchorElActionMenu] = useState<HTMLButtonElement | null>(null);
  const handleMainActionMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElActionMenu(event.currentTarget);
  };

  const { state: paginationState, handlePageChange, handleRowsPerPageChange } = useGeneralPagination();

  // const handleCloseRenterThreeDotsMenu = () => {
  //   setAnchorElRenterThreeDotsMenu(null);
  //   deselectAll();
  // };
  const handleActionMenuClose = () => {
    setAnchorElActionMenu(null);
  };
  const handleObjectDelete = async () => {
    try {
      if (rentalObject?.id) {
        await agent.objects.delete(rentalObject.id);
        router.push("/landlordportal/dashboard/objects");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAnchorElActionMenu(null);
    }
  };

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

  // const handleDialog = useCallback(
  //   (id: string): void => {
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

  const handleDeleteRenterFromObject = async () => {
    try {
      const updatedRenters = (rentalObject.renter as Renter[]).filter((renter: Renter) => !selected.has(renter.id));
      await agent.renter.removeRentalObjectFromRenter(Array.from(selected), rentalObject.id);

      const updatedRentalObject = {
        ...rentalObject,
        renter: updatedRenters,
      };
      setRentalObject(updatedRentalObject);
      toast.success("Mieter erfolgreich gelöscht");
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDeleteModalForRenter(false);
    }
  };

  function handleDeleteRentalObject() {
    setAnchorElActionMenu(null);
    setOpenDeleteModalForRentalObject(true);
  }

  // const handleAddRenter = () => {
  //   setAnchorElActionMenu(null);
  //   setOpenAddRenterModal(true);
  // };

  // const onAddRenter = async (selectedRenterId: string) => {
  //   try {
  //     const selectedRenter = renters.find((renter) => renter.id === selectedRenterId);

  //     if (selectedRenter) {
  //       const updatedRenters = rentalObject.renter ? [...rentalObject.renter, selectedRenter] : [selectedRenter];
  //       const updatedRentalObject = {
  //         ...rentalObject,
  //         renter: updatedRenters,
  //       };
  //       const updatedRentalObjectFromResponse: RentalObject = await agent.objects.update(updatedRentalObject);
  //       setRentalObject(updatedRentalObjectFromResponse);
  //       toast.success("Mieter erfolgreich hinzugefügt");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setOpenAddRenterModal(false);
  //   }
  // };

  // function handleDeleteModalOpenForRenter() {
  //   setAnchorElRenterThreeDotsMenu(null);
  //   setOpenDeleteModalForRenter(true);
  // }

  function handleCancelDeleteRenterFromRentalObjectModal() {
    setOpenDeleteModalForRenter(false);
    deselectAll();
  }

  function handleCancelDeleteRentalObject() {
    setOpenDeleteModalForRentalObject(false);
  }

  const paginatedRenter = useMemo(() => {
    const startIndex = paginationState.page * paginationState.rowsPerPage;
    const endIndex = startIndex + paginationState.rowsPerPage;
    return rentalObject.renter.slice(startIndex, endIndex);
  }, [rentalObject.renter, paginationState.page, paginationState.rowsPerPage]);

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Link
            component={RouterLink}
            color="text.primary"
            sx={{ whiteSpace: "nowrap" }}
            variant="subtitle2"
            href={`${paths.landlordportal.dashboard.renters.details}${row.id}`}
          >
            {row.firstname} {row.surname}
          </Link>
        </div>
      ),
      name: "Name",
    },
    // {
    //   formatter: (row): React.JSX.Element => (
    //     <div>
    //       <Button
    //         // component={RouterLink}
    //         // onClick={() => handleDialog(row.id)}
    //         // href={`${paths.landlordportal.dashboard.renters.details}${row.id}`}
    //         aria-controls={openRenterThreeDotsMenu ? "basic-menu" : undefined}
    //         aria-haspopup="true"
    //         aria-expanded={openRenterThreeDotsMenu ? "true" : undefined}
    //         onClick={(event) => handleClickRenterThreeDotsMenu(event, row)}
    //       >
    //         <SvgIcon>
    //           <DotsVertical />
    //         </SvgIcon>
    //       </Button>
    //       <Menu
    //         id="basic-menu"
    //         anchorEl={anchorElRenterThreeDotsMenu}
    //         open={openRenterThreeDotsMenu}
    //         onClose={handleCloseRenterThreeDotsMenu}
    //         MenuListProps={{
    //           "aria-labelledby": "basic-button",
    //         }}
    //       >
    //         <MenuItem onClick={() => handleDeleteModalOpenForRenter()}>Löschen</MenuItem>
    //       </Menu>
    //     </div>
    //   ),
    //   name: "",
    //   align: "right",
    // },
  ] satisfies ColumnDef<Renter>[];

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
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.landlordportal.dashboard.objects.index}
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
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <Button
                        color="inherit"
                        component={RouterLink}
                        endIcon={
                          <SvgIcon>
                            <Edit02Icon />
                          </SvgIcon>
                        }
                        href={`${paths.landlordportal.dashboard.objects.edit}${rentalObject.id}`}
                      >
                        Ändern
                      </Button>
                      <Button
                        endIcon={
                          <SvgIcon>
                            <ChevronDownIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                        onClick={handleMainActionMenuOpen}
                      >
                        Aktionen
                      </Button>
                      <Menu
                        anchorEl={anchorElActionMenu}
                        open={Boolean(anchorElActionMenu)}
                        onClose={handleActionMenuClose}
                        slotProps={{
                          paper: {
                            style: {
                              maxHeight: 48 * 4.5,
                            },
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleDeleteRentalObject()}>
                          <SvgIcon>
                            <DeleteOutline />
                          </SvgIcon>
                          Objekt löschen
                        </MenuItem>{" "}
                      </Menu>
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
                {currentTab === "renter" && (
                  <Grid xs={12} sx={{ pt: 3 }}>
                    <Card>
                      <DataTable<Renter>
                        columns={columns}
                        rows={(paginatedRenter as Renter[]) || []}
                        onDeselectAll={deselectAll}
                        onDeselectOne={(_, row) => {
                          deselectOne(row.id);
                        }}
                        onSelectAll={selectAll}
                        onSelectOne={(_, row) => {
                          selectOne(row.id);
                        }}
                        selected={selected}
                        // setOpenDeleteModal={setOpenDeleteModal}
                        isLoading={landloadLoading}
                        rowStartIcon={<User03 />}
                        selectable
                      />{" "}
                      {!rentalObject.renter.length && !landloadLoading ? (
                        <Box sx={{ p: 3 }}>
                          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                            Es wurden noch kein Mieter diesem Objekt zugewiesen
                          </Typography>
                        </Box>
                      ) : null}
                      <Divider />
                      <GeneralPagination
                        rowsPerPage={paginationState.rowsPerPage}
                        page={paginationState.page}
                        count={rentalObject.renter.length}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                      />
                    </Card>
                  </Grid>
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
            <RenterDrawer container={rootRef.current} onClose={dialog.handleClose} open={dialog.open} renter={currentRenter} />
          )}
        </Box>
      </Box>
      <DeleteModal
        text={"Möchtest Du wirklich den Mieter von diesem Objekt löschen?"}
        handleCancelDeleteModal={handleCancelDeleteRenterFromRentalObjectModal}
        onDelete={handleDeleteRenterFromObject}
        openDeleteModal={openDeleteModalForRenter}
      />
      <DeleteModal
        text={"Möchtest Du wirklich das Objekt löschen?"}
        handleCancelDeleteModal={handleCancelDeleteRentalObject}
        onDelete={handleObjectDelete}
        openDeleteModal={openDeleteModalForRentalObject}
      />
    </>
  );
}
