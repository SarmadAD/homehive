import { Landlord, RentPayment, RentalObjectInfo } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { RentalObject } from "prisma/types/objects";
import { Renter } from "prisma/types/renter";
import { RepairRequest } from "prisma/types/repairRequest";
import { UserRole } from "prisma/types/userrole";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const objects = {
  list: (landlordId: string) => requests.get<RentalObject[]>(`/api/dashboard/objects/${landlordId}`),
  details: (objectId: string) => requests.get<RentalObject>(`/api/dashboard/objects/object/${objectId}`),
  create: (object: RentalObject) => requests.post<RentalObject>(`/api/dashboard/objects/${object.landlord.id}`, object),
  update: (object: RentalObject) => requests.put<void>(`/api/dashboard/objects/object/${object.id}`, object),
  rentalObjectInfo: (id: string) => requests.get<RentalObjectInfo>(`/rentalObjectInfo/${id}`),
  updateRepairRequest: (repairRequest: RepairRequest) =>
    requests.put<void>(`/api/dashboard/objects/object/repairRequest/${repairRequest.id}`, repairRequest),
  //   delete: (id: string) => requests.del<void>(`/activities/${id}`),
  //   attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const landlord = {
  details: (firebaseUserId: string) => requests.get<Landlord>(`/api/landlord?fbId=${firebaseUserId}`),
  create: (firebaseUserId: string) => requests.post<void>(`/api/landlord/`, firebaseUserId),
};

const renter = {
  details: (firebaseUserId: string) => requests.get<Renter>(`/api/renter?fbId=${firebaseUserId}`),
};

const renters = {
  list: (landlordId: string) => requests.get<Renter[]>(`/api/dashboard/renters/${landlordId}`),
  details: (renterId: string) => requests.get<Renter>(`/api/dashboard/renters/renter/${renterId}`),
  create: (renter: Renter, landlordId: string) => requests.post<void>(`/api/dashboard/renters/${landlordId}`, renter),
  updateFirebaseUserId: (renterId: string, firebaseUserId: string) =>
    requests.put<void>(`/api/dashboard/renters/renter/${renterId}`, firebaseUserId),
};

const userRoles = {
  details: (firebaseUserId: string) => requests.get<UserRole>(`/api/role/${firebaseUserId}`),
};

const rentPayments = {
  update: (rentPayment: RentPayment) => requests.put<void>(`/api/rentPayments/${rentPayment.id}`, rentPayment),
};

const agent = {
  objects,
  landlord,
  renter,
  renters,
  userRoles,
  rentPayments,
};

export default agent;
