import { Landlord, RentalObjectInfo, Renter } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { RentalObject } from "prisma/types/objects";

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
  rentalObjectInfo: (id: string) => requests.get<RentalObjectInfo>(`/rentalObjectInfo/${id}`),
  create: (object: RentalObject) => requests.post<void>(`/api/dashboard/objects/${object.landlord.id}`, object),
  update: (object: RentalObject) => requests.put<void>(`/api/dashboard/objects/object/${object.id}`, object),
  //   delete: (id: string) => requests.del<void>(`/activities/${id}`),
  //   attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const landlord = {
  details: (firebaseUserId: string) => requests.get<Landlord>(`/api/landlord?fbId=${firebaseUserId}`),
};

const renters = {
  list: (landlordId: string) => requests.get<Renter[]>(`/api/dashboard/renters/${landlordId}`),
  details: (renterId: string) => requests.get<Renter>(`/api/dashboard/renters/renter/${renterId}`),
};

const agent = {
  objects,
  landlord,
  renters,
};

export default agent;
